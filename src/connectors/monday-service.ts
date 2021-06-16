import { getItem } from "../services/getItem";
import { getContentFor } from "../services/getContentFor";
import { createGroup } from "../services/createGroup";
import { createItemFromItem } from "../services/createItemFromItem";

export default async (
  token: string | undefined,
  episodeId: number,
  targetBoardId: number
): Promise<string> => {
  if (!token) throw new Error("shortLivedToken is not provided");

  const episode = await getItem(token, episodeId);
  const group = await createGroup(token, targetBoardId, episode);
  await Promise.all(
    getContentFor(episode).map((content) =>
      createItemFromItem(token, targetBoardId, group, content, episode)
    )
  );

  return `Created content for ${episode.name}`;
};
