import { Mutex, withTimeout } from "async-mutex";

import type { ItemType } from "../types";

import MondayClient from "../monday-api";

import { getItem } from "../monday-api/queries/get-item";
import { getBoard } from "../monday-api/queries/get-board";
import { archiveGroup } from "../monday-api/queries/archive-group";
import { archiveItem } from "../monday-api/queries/archive-item";
import { getItemsInGroupContainingItem } from "../monday-api/queries/get-items-in-group-containing-item";
import { findOrCreateGroup } from "../monday-api/queries/find-or-create-group";

import { createItemsInGroupOnBoard } from "../services/createItemsInGroupOnBoard";
import { isItemArchived } from "../services/is-item-archived";
import MutexTimeoutError from "../errors/mutex-timeout-error";

const CRITICAL_SECTION_TIMEOUT_MS = 10000;
const mutex = withTimeout(
  new Mutex(),
  CRITICAL_SECTION_TIMEOUT_MS,
  new MutexTimeoutError()
);

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

const createGroupInBoardInCritcalSection = (
  client: MondayClient,
  boardId: number,
  item: ItemType
) =>
  mutex.runExclusive(async () => {
    const board = await getBoard(client, boardId);
    const group = await findOrCreateGroup(client, board, item.group.title);

    return { board, group };
  });

export default async (
  client: MondayClient,
  boardId: number,
  itemId: number
): Promise<string> => {
  const item = await getItem(client, itemId);
  if (isItemArchived(item)) return `The item has already been moved`;

  const { board, group } = await createGroupInBoardInCritcalSection(
    client,
    boardId,
    item
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
