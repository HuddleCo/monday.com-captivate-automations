import { Mutex, withTimeout } from "async-mutex";
import MondayApi from "../../mondayApi";

import MutexTimeoutError from "../../errors/mutexTimeoutError";

import { getItem } from "../../mondayApi/queries/getItem";
import { columnIsSameForAllItems } from "../../services/columnIsSameForAllItems";
import { getItemsInGroupContainingItem } from "../../mondayApi/queries/getItemsInGroupContainingItem";

import { createItemsInGroupOnBoard } from "../../services/createItemsInGroupOnBoard";
import { findOrCreateGroupInBoard } from "../../services/findOrCreateGroupInBoard";
import { archiveGroup } from "../../mondayApi/queries/archiveGroup";
import { ItemType } from "../../types";
import NoItemsInGroupError from "./noItemsInGroupError";
import DifferentStatusError from "./differentStatusError";
import GroupAlreadyArchivedError from "./groupAlreadyArchivedError";

const CRITICAL_SECTION_TIMEOUT_MS = 12_000;
const mutex = withTimeout(
  new Mutex(),
  CRITICAL_SECTION_TIMEOUT_MS,
  new MutexTimeoutError(CRITICAL_SECTION_TIMEOUT_MS)
);

const getMyItem = (client: MondayApi, itemId: number) =>
  getItem(client, itemId).then((item) => {
    if (item.group.archived) throw new GroupAlreadyArchivedError();

    return item;
  });

const getMyItems = (
  client: MondayApi,
  item: ItemType,
  statusColumnId: string,
  status: string
) =>
  getItemsInGroupContainingItem(client, item).then((items) => {
    if (!items.length) throw new NoItemsInGroupError();

    if (!columnIsSameForAllItems(items, statusColumnId, status)) {
      throw new DifferentStatusError(status);
    }
    return items;
  });

const getItems = (
  client: MondayApi,
  itemId: number,
  statusColumnId: string,
  status: string
) =>
  getMyItem(client, itemId).then((item) =>
    getMyItems(client, item, statusColumnId, status).then((items) => ({
      item,
      items,
    }))
  );

const copyItemsToBoard = (
  client: MondayApi,
  item: ItemType,
  items: ItemType[],
  boardId: number
) =>
  findOrCreateGroupInBoard(client, boardId, item.group.title).then(
    ({ board, group }) => createItemsInGroupOnBoard(client, board, group, items)
  );

export default async (
  client: MondayApi,
  itemId: number,
  statusColumnId: string,
  status: string,
  boardId: number
): Promise<true> =>
  mutex
    .runExclusive(() => getItems(client, itemId, statusColumnId, status))
    .then(({ item, items }) =>
      Promise.all([
        archiveGroup(client, item.board.id, item.group.id),
        copyItemsToBoard(client, item, items, boardId),
      ])
    )
    .catch((err) => {
      if (err instanceof GroupAlreadyArchivedError) return;
      if (err instanceof NoItemsInGroupError) return;
      if (err instanceof DifferentStatusError) return;

      throw err;
    })
    .then(() => true);
