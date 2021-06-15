import { getItem } from "./getItem";
import { getContentFor } from "./getContentFor";
import { createGroup } from "./createGroup";
import { createItemFromItem } from "./createItemFromItem";

class MondayService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async createContentFromEpisodeToBoard(
    token: string,
    episodeId: number,
    targetBoardId: number
  ): Promise<string> {
    const episode = await getItem(token, episodeId);
    const group = await createGroup(token, targetBoardId, episode);
    await Promise.all(
      getContentFor(episode).map((content) =>
        createItemFromItem(token, targetBoardId, group, content, episode)
      )
    );

    return `Created content for ${episode.name}`;
  }
}

export default MondayService;
