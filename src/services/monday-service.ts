import type {
  ItemType,
  GroupType,
  CreateItemType,
  CreateGroupType,
} from "../types";
import { getItem } from "./getItem";
import { clientNameFor } from "./clientNameFor";
import { columnValuesForCreatingEpsiode } from "./columnValuesForCreatingEpsiode";
import { getContentFor } from "./getContentFor";
import { performQuery } from "./queryCounter";

class MondayService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async createContentFromEpisodeToBoard(
    episodeId: number,
    targetBoardId: number
  ): Promise<string> {
    const episode = await getItem(this.token, episodeId);
    const group = await this.createGroup(targetBoardId, episode);
    await Promise.all(
      getContentFor(episode).map((content) =>
        this.createItemFromItem(targetBoardId, group, content, episode)
      )
    );

    return `Created content for ${episode.name}`;
  }

  private async createGroup(
    boardId: number,
    episode: ItemType
  ): Promise<GroupType> {
    const data = await performQuery<CreateGroupType>(
      this.token,
      `mutation($boardId: Int!, $groupName: String!) {
        create_group (board_id: $boardId, group_name: $groupName) {
          id
        }
      }`,
      {
        boardId,
        groupName: `${clientNameFor(episode)} - ${episode.name}`,
      }
    );

    return { id: data.create_group.id };
  }

  private async createItemFromItem(
    boardId: number,
    group: GroupType,
    content: string,
    episode: ItemType
  ): Promise<number> {
    try {
      const columnValues = {
        ...columnValuesForCreatingEpsiode(episode),
        status_1: { label: content },
        status_17: { label: content },
      };

      const data = await performQuery<CreateItemType>(
        this.token,
        `mutation($boardId: Int!, $groupId: String, $itemName: String, $columnValues: JSON) {
          create_item (board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues, create_labels_if_missing: true) {
            id
          }
        }`,
        {
          boardId,
          groupId: group.id,
          itemName: `${content} - ${clientNameFor(episode)}`,
          columnValues: JSON.stringify(columnValues),
        }
      );

      return data.create_item.id;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default MondayService;
