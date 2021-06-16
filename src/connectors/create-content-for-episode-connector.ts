import { getItem } from "../monday-api/queries/get-item";
import { getContentForEpisode } from "../services/get-content-for-episode";
import { createGroup } from "../monday-api/queries/create-group";
import { createItemFromItem } from "../monday-api/queries/create-item-from-item";
import MondayClient from "../monday-api";

export default async (
  client: MondayClient,
  episodeId: number,
  targetBoardId: number
): Promise<string> => {
  const episode = await getItem(client, episodeId);
  const group = await createGroup(client, targetBoardId, episode);
  await Promise.all(
    getContentForEpisode(episode).map((content) =>
      createItemFromItem(client, targetBoardId, group, content, episode)
    )
  );

  return `Created content for ${episode.name}`;
};
