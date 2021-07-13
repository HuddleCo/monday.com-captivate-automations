import { Mutex, withTimeout } from "async-mutex";
import MondayClient from "../mondayApi";

import MutexTimeoutError from "../errors/mutexTimeoutError";

import { getItem } from "../mondayApi/queries/getItem";
import { columnIsSameForAllItems } from "../services/columnIsSameForAllItems";
import { getItemsInGroupContainingItem } from "../mondayApi/queries/getItemsInGroupContainingItem";

import { createItemsInGroupOnBoard } from "../services/createItemsInGroupOnBoard";
import { findOrCreateGroupInBoard } from "../services/findOrCreateGroupInBoard";
import { archiveGroup } from "../mondayApi/queries/archiveGroup";

const CRITICAL_SECTION_TIMEOUT_MS = 12_000;
const mutex = withTimeout(
  new Mutex(),
  CRITICAL_SECTION_TIMEOUT_MS,
  new MutexTimeoutError(CRITICAL_SECTION_TIMEOUT_MS)
);

export default async (
  client: MondayClient,
  itemId: number,
  statusColumnId: string,
  status: string,
  boardId: number
): Promise<string> =>
  mutex.runExclusive(async () => {
    const item = await getItem(client, itemId);
    if (item.group.archived) return `The group has already been archived`;

    const items = await getItemsInGroupContainingItem(client, item);
    if (!items.length)
      return `The group has no items. Have already been processed`;

    if (!columnIsSameForAllItems(items, statusColumnId, status))
      return `Some items are not ${status}. Abort`;

    const archivedGroup = await archiveGroup(
      client,
      item.board.id,
      item.group.id
    );

    const { board, group } = await findOrCreateGroupInBoard(
      client,
      boardId,
      item.group.title
    );

    await createItemsInGroupOnBoard(client, board, group, items);

    return `All items with ${status} have been copied to group: ${group.title}(#${group.id}) in board: ${board.name}(#${board.id}). The ${archivedGroup.title}(#${archivedGroup.id}) has been archived`;
  });
