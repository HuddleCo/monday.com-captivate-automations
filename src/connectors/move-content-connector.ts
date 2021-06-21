import { allItemsMatch } from "../services/all-items-match";
import { getItem } from "../monday-api/queries/get-item";
import { getItemsInGroupContainingItem } from "../monday-api/queries/get-items-in-group-containing-item";
import MondayClient from "../monday-api";
import { createItem } from "../monday-api/queries/create-item";
import { getBoard } from "../monday-api/queries/get-board";
import { cloneItemColumnsForBoard } from "../services/clone-item-columns-for-board";
import { BoardType, ItemType } from "../types";
import { createGroup } from "../monday-api/queries/create-group";

const columnValues = (item: ItemType, board: BoardType): string =>
  JSON.stringify(cloneItemColumnsForBoard(item, board));

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
  const group = await createGroup(client, board.id, content.group.title);

  if (!allItemsMatch(contents, statusColumnId, status))
    return `Some contents are not ${status}. Abort`;

  Promise.all(
    contents.map((item) =>
      createItem(
        client,
        board.id,
        group.id,
        item.name,
        columnValues(item, board)
      )
    )
  );

  return `All contents are ${status}. Autobots roll-out!`;
};
