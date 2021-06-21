import type { BoardType, GroupType, ItemType } from "../types";
import { allItemsMatch } from "../services/all-items-match";
import { getItem } from "../monday-api/queries/get-item";
import { getItemsInGroupContainingItem } from "../monday-api/queries/get-items-in-group-containing-item";
import MondayClient from "../monday-api";
import { createItem } from "../monday-api/queries/create-item";
import { getBoard } from "../monday-api/queries/get-board";
import { cloneItemColumnsForBoard } from "../services/clone-item-columns-for-board";
import { createGroup } from "../monday-api/queries/create-group";
import { archiveGroup } from "../monday-api/queries/archive-group";

const createItemsInGroupOnBoard = async (
  client: MondayClient,
  board: BoardType,
  group: GroupType,
  items: ItemType[]
) =>
  Promise.all(
    items.map((item) =>
      createItem(
        client,
        board.id,
        group.id,
        item.name,
        JSON.stringify(cloneItemColumnsForBoard(item, board))
      )
    )
  );

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

  const group = await createGroup(client, board.id, content.group.title);

  await createItemsInGroupOnBoard(client, board, group, contents);
  const archivedGroup = await archiveGroup(
    client,
    content.board.id,
    content.group.id
  );

  return `All content with ${status} have been copied to group: ${group.title}(#${group.id}) in board: ${board.name}(#${board.id}). The ${archivedGroup.title}(#${archivedGroup.id}) has been archived`;
};
