import { getItem } from "../monday-api/queries/getItem";
import { getContentFor } from "../services/getContentFor";
import { createGroup } from "../monday-api/queries/createGroup";
import { createItemFromItem } from "../monday-api/queries/createItemFromItem";
import MondayClient from "../monday-api";

export default async (
  client: MondayClient,
  episodeId: number,
  targetBoardId: number
): Promise<string> => {
  const episode = await getItem(client, episodeId);
  const group = await createGroup(client, targetBoardId, episode);
  await Promise.all(
    getContentFor(episode).map((content) =>
      createItemFromItem(client, targetBoardId, group, content, episode)
    )
  );

  return `Created content for ${episode.name}`;
};
