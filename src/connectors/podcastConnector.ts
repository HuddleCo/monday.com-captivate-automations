import { Mutex, withTimeout } from "async-mutex";

import MondayApi from "../mondayApi";
import { getItem } from "../mondayApi/queries/getItem";
import { getBoard } from "../mondayApi/queries/getBoard";
import { isDuplicateItem } from "../mondayApi/queries/isDuplicateItem";

import { podcastIsNotRequired } from "../services/podcastIsNotRequired";
import { createItemsInGroupOnBoard } from "../services/createItemsInGroupOnBoard";

import MutexTimeoutError from "../errors/mutexTimeoutError";

import type { BoardType, GroupType, ItemType } from "../types";

const topMostGroup = (groups: Array<GroupType>): GroupType =>
  groups.sort((a, b) => a.position - b.position)[0];

const CRITICAL_SECTION_TIMEOUT_MS = 4_000;
const mutex = withTimeout(
  new Mutex(),
  CRITICAL_SECTION_TIMEOUT_MS,
  new MutexTimeoutError(CRITICAL_SECTION_TIMEOUT_MS)
);

const getContext = (
  client: MondayApi,
  boardId: number,
  itemId: number,
  callback: (
    board: BoardType,
    topGroup: GroupType,
    item: ItemType
  ) => Promise<string>
): Promise<string> =>
  mutex.runExclusive(() =>
    Promise.all([getItem(client, itemId), getBoard(client, boardId)]).then(
      ([item, board]) => callback(board, topMostGroup(board.groups), item)
    )
  );

const createItemInGroupOnBoard = (
  client: MondayApi,
  board: BoardType,
  topGroup: GroupType,
  item: ItemType
): Promise<void> => createItemsInGroupOnBoard(client, board, topGroup, [item]);

export default async (
  client: MondayApi,
  boardId: number,
  itemId: number
): Promise<string> =>
  getContext(client, boardId, itemId, async (board, topGroup, item) => {
    if (podcastIsNotRequired(item))
      return "Podcast is not required for this episode. Ignoring action";

    if (await isDuplicateItem(client, board.id, topGroup.id, item.name))
      return `The episode "${item.name}" has already been copied. Ignoring action`;

    await createItemInGroupOnBoard(client, board, topGroup, item);

    return `Episode "${item.name}" has been copied to the ${board.name} board`;
  });
