import MondayClient from "../monday-api";

import { getItem } from "../monday-api/queries/get-item";
import { columnIsSameForAllItems } from "../services/column-is-same-for-all-items";
import { archiveGroup } from "../monday-api/queries/archive-group";
import { getItemsInGroupContainingItem } from "../monday-api/queries/get-items-in-group-containing-item";

import { createItemsInGroupOnBoard } from "../services/createItemsInGroupOnBoard";
import { findOrCreateGroupInBoard } from "../services/find-or-create-group-in-board";

export default async (
  client: MondayClient,
  itemId: number,
  statusColumnId: string,
  status: string,
  boardId: number
): Promise<string> => {
  const item = await getItem(client, itemId);
  if (item.group.archived) return `The group has already been archived`;

  const items = await getItemsInGroupContainingItem(client, item);
  if (!items.length)
    return `The group has no items. Have already been processed`;

  if (!columnIsSameForAllItems(items, statusColumnId, status))
    return `Some items are not ${status}. Abort`;

  let archivedGroup;
  try {
    archivedGroup = await archiveGroup(client, item.board.id, item.group.id);
  } catch (err) {
    return "Tried to archive group but it was not found. This is ok because the group may have already been processed";
  }

  const { board, group } = await findOrCreateGroupInBoard(
    client,
    boardId,
    item.group.title
  );

  await createItemsInGroupOnBoard(client, board, group, items);

  return `All items with ${status} have been copied to group: ${group.title}(#${group.id}) in board: ${board.name}(#${board.id}). The ${archivedGroup.title}(#${archivedGroup.id}) has been archived`;
};
