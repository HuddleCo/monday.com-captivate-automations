import { ItemType } from "../types";

import MondayApi from "../mondayApi";

import { getItem } from "../mondayApi/queries/getItem";
import { archiveGroup } from "../mondayApi/queries/archiveGroup";
import { archiveItem } from "../mondayApi/queries/archiveItem";
import { getItemsInGroupContainingItem } from "../mondayApi/queries/getItemsInGroupContainingItem";

import { createItemsInGroupOnBoard } from "../services/createItemsInGroupOnBoard";
import { isItemArchived } from "../services/isItemArchived";
import { findOrCreateGroupInBoard } from "../services/findOrCreateGroupInBoard";

const archiveGroupIfEmpty = (
  client: MondayApi,
  item: ItemType
): Promise<boolean> =>
  getItemsInGroupContainingItem(client, item).then((items) =>
    items.length
      ? false
      : archiveGroup(client, item.board.id, item.group.id)
          .then(() => true)
          .catch(
            () => false // Don't care why archiving the group failed
          )
  );

const getDestinationGroup = (
  client: MondayApi,
  boardId: number,
  item: { group: { title: string } }
) => findOrCreateGroupInBoard(client, boardId, item.group.title);

const moveItem = (client: MondayApi, boardId: number, item: ItemType) =>
  getDestinationGroup(client, boardId, item).then(({ board, group }) =>
    Promise.all([
      createItemsInGroupOnBoard(client, board, group, [item]),
      archiveItem(client, item.id),
    ])
  );

export default (
  client: MondayApi,
  boardId: number,
  itemId: number
): Promise<string> =>
  getItem(client, itemId).then((item) =>
    isItemArchived(item)
      ? `The item has already been moved`
      : moveItem(client, boardId, item)
          .then(() => archiveGroupIfEmpty(client, item))
          .then(() => `Item ${item.name} has been moved: ${item.group.title}`)
  );
