import { getItem } from "./getItem";
import { getContentFor } from "./getContentFor";
import { createGroup } from "./createGroup";
import { createItemFromItem } from "./createItemFromItem";

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
