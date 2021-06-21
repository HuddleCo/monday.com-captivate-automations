import MondayClient from "../monday-api";
import { getItem } from "../monday-api/queries/get-item";
import { episodeContents } from "../services/episode-contents";
import { createGroup } from "../monday-api/queries/create-group";
import { clientNameForEpisode } from "../services/client-name-for-episode";
import { createItem } from "../monday-api/queries/create-item";
import { getBoard } from "../monday-api/queries/get-board";
import { cloneItemColumnsForBoard } from "../services/clone-item-columns-for-board";
import {
  ASSET_TYPE_COLUMN_TITLE,
  EPISODE_NAME_COLUMN_TITLE,
} from "../constants";
import type { BoardType } from "../types";

const columnId = (board: BoardType, columnTitle: string): string =>
  board.columns.find(({ title }) => title.trim() === columnTitle)?.id ||
  "Title";

export default async (
  client: MondayClient,
  episodeId: number,
  targetBoardId: number
): Promise<string> => {
  const episode = await getItem(client, episodeId);
  const group = await createGroup(
    client,
    targetBoardId,
    `${clientNameForEpisode(episode)} - ${episode.name}`
  );
  const board = await getBoard(client, targetBoardId);

  await Promise.all(
    episodeContents(episode).map((content) =>
      createItem(
        client,
        targetBoardId,
        group.id,
        `${content} - ${clientNameForEpisode(episode)}`,
        JSON.stringify({
          ...cloneItemColumnsForBoard(episode, board),
          [columnId(board, EPISODE_NAME_COLUMN_TITLE)]: {
            item_ids: [episode.id],
          },
          [columnId(board, ASSET_TYPE_COLUMN_TITLE)]: { label: content },
        })
      )
    )
  );

  return `Created content for ${episode.name}`;
};
