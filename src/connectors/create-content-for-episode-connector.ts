import type { BoardType, GroupType, ItemType } from "../types";

import MondayClient from "../monday-api";
import { getItem } from "../monday-api/queries/get-item";
import { createGroup } from "../monday-api/queries/create-group";
import { createItem } from "../monday-api/queries/create-item";
import { getBoard } from "../monday-api/queries/get-board";

import { episodeContents } from "../services/episode-contents";
import { clientNameForEpisode } from "../services/client-name-for-episode";
import { cloneItemColumnsForBoard } from "../services/clone-item-columns-for-board";

import {
  ASSET_TYPE_COLUMN_TITLE,
  EPISODE_NAME_COLUMN_TITLE,
} from "../constants";

const columnId = (board: BoardType, columnTitle: string): string =>
  board.columns.find(({ title }) => title.trim() === columnTitle)?.id ||
  "Title";

const createContentInGroupOnBoard = async (
  client: MondayClient,
  board: BoardType,
  group: GroupType,
  item: ItemType
) =>
  Promise.all(
    episodeContents(item).map((content) =>
      createItem(
        client,
        board.id,
        group.id,
        `${content} - ${clientNameForEpisode(item)}`,
        JSON.stringify({
          ...cloneItemColumnsForBoard(item, board),
          [columnId(board, EPISODE_NAME_COLUMN_TITLE)]: {
            item_ids: [item.id],
          },
          [columnId(board, ASSET_TYPE_COLUMN_TITLE)]: { label: content },
        })
      )
    )
  );

const createGroupWithEpisodeName = async (
  client: MondayClient,
  board: BoardType,
  item: ItemType
) =>
  createGroup(client, board.id, `${clientNameForEpisode(item)} - ${item.name}`);

export default async (
  client: MondayClient,
  itemId: number,
  boardId: number
): Promise<string> => {
  const [item, board] = await Promise.all([
    getItem(client, itemId),
    getBoard(client, boardId),
  ]);

  const group = await createGroupWithEpisodeName(client, board, item);

  await createContentInGroupOnBoard(client, board, group, item);

  return `Created content for ${item.name}`;
};
