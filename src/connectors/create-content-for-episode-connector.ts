import MondayClient from "../monday-api";
import { getItem } from "../monday-api/queries/get-item";
import { episodeContents } from "../services/episode-contents";
import { createGroup } from "../monday-api/queries/create-group";
import { clientNameForEpisode } from "../services/client-name-for-episode";
import { columnValuesForCreatingEpsiode } from "../services/column-values-for-creating-epsiode";
import { createItem } from "../monday-api/queries/create-item";

export default async (
  client: MondayClient,
  episodeId: number,
  targetBoardId: number
): Promise<string> => {
  const episode = await getItem(client, episodeId);
  const group = await createGroup(client, targetBoardId, episode);

  await Promise.all(
    episodeContents(episode).map((content) =>
      createItem(
        client,
        targetBoardId,
        group.id,
        `${content} - ${clientNameForEpisode(episode)}`,
        JSON.stringify({
          ...columnValuesForCreatingEpsiode(episode),
          status_1: { label: content },
          status_17: { label: content },
        })
      )
    )
  );

  return `Created content for ${episode.name}`;
};
