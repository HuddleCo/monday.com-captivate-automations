import type { ItemType } from "../types";

import MondayClient from "../mondayApi";

import { getItem } from "../mondayApi/queries/getItem";
import { archiveGroup } from "../mondayApi/queries/archiveGroup";
import { archiveItem } from "../mondayApi/queries/archiveItem";
import { getItemsInGroupContainingItem } from "../mondayApi/queries/getItemsInGroupContainingItem";

import { createItemsInGroupOnBoard } from "../services/createItemsInGroupOnBoard";
import { isItemArchived } from "../services/isItemArchived";
import { findOrCreateGroupInBoard } from "../services/findOrCreateGroupInBoard";

const archiveEmptyGroup = async (
  client: MondayClient,
  item: ItemType
): Promise<boolean> => {
  const items = await getItemsInGroupContainingItem(client, item);
  if (items.length) return false;

  try {
    await archiveGroup(client, item.board.id, item.group.id);
  } catch (err) {
    // Don't care why archiving a group failed
    return false;
  }
  return true;
};

export default async (
  client: MondayClient,
  boardId: number,
  itemId: number
): Promise<string> => {
  const item = await getItem(client, itemId);
  if (isItemArchived(item)) return `The item has already been moved`;

  const { board, group } = await findOrCreateGroupInBoard(
    client,
    boardId,
    item.group.title
  );

  await Promise.all([
    createItemsInGroupOnBoard(client, board, group, [item]),
    archiveItem(client, item.id),
  ]);

  const messages = [
    `Item ${item.name}(#${item.id}) has been moved to group: ${group.title}(#${group.id}) in board: ${board.name}(#${board.id}).`,
  ];

  if (await archiveEmptyGroup(client, item))
    messages.push(
      `Tried to archive group ${item.group.title}(#${item.group.id}) but it was not found. This is ok because the group may have already been processed`
    );
  return messages.join(". ");
};
