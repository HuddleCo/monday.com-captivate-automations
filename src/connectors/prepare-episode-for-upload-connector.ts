import { allItemsMatch } from "../services/all-items-match";
import { getItem } from "../monday-api/queries/get-item";
import { getItemsInGroupContainingItem } from "../monday-api/queries/get-items-in-group-containing-item";
import MondayClient from "../monday-api";
import { createItem } from "../monday-api/queries/create-item";
import { episodeName } from "../services/episode-name";
import { getBoard } from "../monday-api/queries/get-board";
import { cloneItemColumnsForBoard } from "../services/clone-item-columns-for-board";
import { CONTENT_LINKS_COLUMN_ID } from "../constants";
import { mergeLinks } from "../services/merge-links";
import { BoardType, ItemType } from "../types";

const columnValues = (contents: ItemType[], board: BoardType): string =>
  JSON.stringify({
    ...cloneItemColumnsForBoard(contents[0], board),
    [CONTENT_LINKS_COLUMN_ID]: { text: mergeLinks(contents) },
  });

export default async (
  client: MondayClient,
  itemId: number,
  statusColumnId: string,
  status: string,
  boardId: number
): Promise<string> => {
  const content = await getItem(client, itemId);
  const contents = await getItemsInGroupContainingItem(client, content);
  const board = await getBoard(client, boardId);

  if (!allItemsMatch(contents, statusColumnId, status))
    return `Some contents are not ${status}. Abort`;

  await createItem(
    client,
    boardId,
    "",
    episodeName(content),
    columnValues(contents, board)
  );

  return `All contents are ${status}. Autobots roll-out!`;
};
