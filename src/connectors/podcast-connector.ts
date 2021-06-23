import MondayClient from "../monday-api";

import { getItem } from "../monday-api/queries/get-item";
import { getBoard } from "../monday-api/queries/get-board";

import { createItemsInGroupOnBoard } from "../services/createItemsInGroupOnBoard";

import { podcastIsNotRequired } from "../services/podcast-is-not-required";
import { isDuplicateItem } from "../services/is-duplicate-item";

export default async (
  client: MondayClient,
  boardId: number,
  itemId: number
): Promise<string> => {
  const [item, board] = await Promise.all([
    getItem(client, itemId),
    getBoard(client, boardId),
  ]);

  if (podcastIsNotRequired(item))
    return "Podcast is not required for this episode. Ignoring action";

  const topGroup = board.groups.sort((a, b) => a.position - b.position)[0];

  if (await isDuplicateItem(client, board, topGroup, item))
    return `The episode has already been copied. Ignoring action`;

  await createItemsInGroupOnBoard(client, board, topGroup, [item]);

  return `Episode ${item.name} has been copied to the ${board.name} board`;
};
