import { Mutex, withTimeout } from "async-mutex";
import MondayClient from "../mondayApi";

import { getItem } from "../mondayApi/queries/getItem";
import { getBoard } from "../mondayApi/queries/getBoard";
import { isDuplicateItem } from "../mondayApi/queries/isDuplicateItem";

import { createItemsInGroupOnBoard } from "../services/createItemsInGroupOnBoard";
import { podcastIsNotRequired } from "../services/podcastIsNotRequired";
import type { GroupType } from "../types";
import MutexTimeoutError from "../errors/mutexTimeoutError";

const topMostGroup = (groups: Array<GroupType>): GroupType =>
  groups.sort((a, b) => a.position - b.position)[0];

const CRITICAL_SECTION_TIMEOUT_MS = 4_000;
const mutex = withTimeout(
  new Mutex(),
  CRITICAL_SECTION_TIMEOUT_MS,
  new MutexTimeoutError(CRITICAL_SECTION_TIMEOUT_MS)
);

export default async (
  client: MondayClient,
  boardId: number,
  itemId: number
): Promise<string> =>
  mutex.runExclusive(async () => {
    const [item, board] = await Promise.all([
      getItem(client, itemId),
      getBoard(client, boardId),
    ]);

    if (podcastIsNotRequired(item))
      return "Podcast is not required for this episode. Ignoring action";

    const topGroup = topMostGroup(board.groups);

    if (await isDuplicateItem(client, board, topGroup, item))
      return `The episode "${item.name}" has already been copied. Ignoring action`;

    await createItemsInGroupOnBoard(client, board, topGroup, [item]);

    return `Episode "${item.name}" has been copied to the ${board.name} board`;
  });
