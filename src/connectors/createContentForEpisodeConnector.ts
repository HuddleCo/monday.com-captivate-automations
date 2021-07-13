import type { BoardType, GroupType, ItemType } from "../types";

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

const createContentInGroupOnBoard = async (
  client: MondayApi,
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
  client: MondayApi,
  board: BoardType,
  item: ItemType
) =>
  createGroup(client, board.id, `${clientNameForEpisode(item)} - ${item.name}`);

export default async (
  client: MondayApi,
  itemId: number,
  boardId: number
): Promise<string> => {
  const [item, board] = await Promise.all([
    getItem(client, itemId),
    getBoard(client, boardId),
  ]);

  const group = await createGroupWithEpisodeName(client, board, item);

  try {
    await createContentInGroupOnBoard(client, board, group, item);
  } catch (err) {
    await archiveGroup(client, board.id, group.id);
    throw err;
  }

  return `Created content for ${item.name}`;
};
