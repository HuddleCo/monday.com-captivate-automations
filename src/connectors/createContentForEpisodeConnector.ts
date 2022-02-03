import type { BoardType, ItemType } from "../types";

import MondayApi from "../mondayApi";
import { getItem } from "../mondayApi/queries/getItem";
import { createGroup } from "../mondayApi/queries/createGroup";
import { createItem } from "../mondayApi/queries/createItem";
import { getBoard } from "../mondayApi/queries/getBoard";
import { archiveGroup } from "../mondayApi/queries/archiveGroup";

import { episodeContents } from "../services/episodeContents";
import { clientNameForEpisode } from "../services/clientNameForEpisode";
import { cloneItemColumnsForBoard } from "../services/cloneItemColumnsForBoard";

import {
  ASSET_TYPE_COLUMN_TITLE,
  EPISODE_NAME_COLUMN_TITLE,
} from "../constants";

const columnId = (board: BoardType, columnTitle: string): string =>
  board.columns.find(({ title }) => title.trim() === columnTitle)?.id ||
  "Title";

const createDestinationGroup = (
  client: MondayApi,
  board: BoardType,
  item: ItemType
) =>
  createGroup(client, board.id, `${clientNameForEpisode(item)} - ${item.name}`);

const values = (item: ItemType, board: BoardType, content: string) => ({
  ...cloneItemColumnsForBoard(item, board),
  [columnId(board, EPISODE_NAME_COLUMN_TITLE)]: {
    item_ids: [item.id],
  },
  [columnId(board, ASSET_TYPE_COLUMN_TITLE)]: { label: content },
});

const copyItem = (
  client: MondayApi,
  board: BoardType,
  groupId: string,
  item: ItemType,
  name: string
) =>
  createItem(
    client,
    board.id,
    groupId,
    `${name} - ${clientNameForEpisode(item)}`,
    JSON.stringify(values(item, board, name))
  );

const items = (
  client: MondayApi,
  board: BoardType,
  groupId: string,
  item: ItemType
) =>
  episodeContents(item).map((itemName) =>
    copyItem(client, board, groupId, item, itemName)
  );

const createItems = (
  client: MondayApi,
  board: BoardType,
  groupId: string,
  item: ItemType
) => Promise.all(items(client, board, groupId, item));

const createItemsInNewGroup = (
  client: MondayApi,
  board: BoardType,
  item: ItemType
) =>
  createDestinationGroup(client, board, item).then(({ id }) =>
    createItems(client, board, id, item).catch((err) =>
      archiveGroup(client, board.id, id).then(() => {
        throw err;
      })
    )
  );

const getContext = (client: MondayApi, boardId: string, itemId: number) =>
  Promise.all([getItem(client, itemId), getBoard(client, boardId)]).then(
    ([item, board]) => ({ item, board })
  );

export default (
  client: MondayApi,
  itemId: number,
  boardId: string
): Promise<string> =>
  getContext(client, boardId, itemId).then(({ item, board }) =>
    createItemsInNewGroup(client, board, item).then(
      () => `Created items for ${item.name}`
    )
  );
