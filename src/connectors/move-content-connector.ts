import MondayClient from "../monday-api";

import { getItem } from "../monday-api/queries/get-item";
import { getBoard } from "../monday-api/queries/get-board";
import { createGroup } from "../monday-api/queries/create-group";
import { columnIsSameForAllItems } from "../services/column-is-same-for-all-items";
import { archiveGroup } from "../monday-api/queries/archive-group";
import { getItemsInGroupContainingItem } from "../monday-api/queries/get-items-in-group-containing-item";

import { createItemsInGroupOnBoard } from "../services/createItemsInGroupOnBoard";

export default async (
  client: MondayClient,
  itemId: number,
  statusColumnId: string,
  status: string,
  boardId: number
): Promise<string> => {
  const item = await getItem(client, itemId);
  const items = await getItemsInGroupContainingItem(client, item);
  const board = await getBoard(client, boardId);

  if (!columnIsSameForAllItems(items, statusColumnId, status))
    return `Some items are not ${status}. Abort`;

  const group = await createGroup(client, board.id, item.group.title);

  await createItemsInGroupOnBoard(client, board, group, items);
  const archivedGroup = await archiveGroup(
    client,
    item.board.id,
    item.group.id
  );

  return `All items with ${status} have been copied to group: ${group.title}(#${group.id}) in board: ${board.name}(#${board.id}). The ${archivedGroup.title}(#${archivedGroup.id}) has been archived`;
};
