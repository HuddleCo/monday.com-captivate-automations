import initMondayClient from "monday-sdk-js";

import type {
  ItemType,
  GroupType,
  Response,
  GetItemsType,
  CreateItemType,
  CreateGroupType,
  OptionsType,
} from "../types";
import { clientNameFor } from "./clientNameFor";
import { columnValuesForCreatingEpsiode } from "./columnValuesForCreatingEpsiode";
import { getContentFor } from "./getContentFor";

class MondayService {
  private mondayClient;

  private cachedGetItem: Record<number, ItemType>;

  private queryCounter: number;

  constructor(apiToken: string) {
    this.mondayClient = initMondayClient();
    this.mondayClient.setToken(apiToken);

    this.cachedGetItem = {};
    this.queryCounter = 0;
  }

  async createContentFromEpisodeToBoard(
    episodeId: number,
    targetBoardId: number
  ): Promise<string> {
    const episode = await this.getItem(episodeId);
    const group = await this.createGroup(targetBoardId, episode);
    await Promise.all(
      getContentFor(episode).map((content) =>
        this.createItemFromItem(targetBoardId, group, content, episode)
      )
    );

    return `Created content for ${episode.name}`;
  }

  private async getItem(itemId: number): Promise<ItemType> {
    if (this.cachedGetItem[itemId]) return this.cachedGetItem[itemId];

    try {
      const data = await this.performQuery<GetItemsType>(
        `query($itemId: [Int]) {
          items (ids: $itemId) {
            name
            column_values {
              id
              title
              value
              type
              text
            }
            board {
              columns {
                id
                title
                type
                settings_str
              }
            }
          }
        }`,
        {
          itemId,
        }
      );

      const item = data.items[0];
      item.board.columns = item.board.columns.map((column) => ({
        ...column,
        settings: JSON.parse(column.settings_str),
      }));

      this.cachedGetItem[itemId] = item;

      return item;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async createGroup(
    boardId: number,
    episode: ItemType
  ): Promise<GroupType> {
    const data = await this.performQuery<CreateGroupType>(
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

      const data = await this.performQuery<CreateItemType>(
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

  private async performQuery<T>(
    query: string,
    variables: OptionsType
  ): Promise<T> {
    const response: Response = await this.mondayClient.api(query, {
      variables,
    });

    console.log("-------------");
    console.log(`Query ${(this.queryCounter += 1)}:`);
    console.log(query);
    console.log("Variables:");
    console.log(variables);
    console.dir(response, { depth: null });
    console.log("-------------");

    if (response.errors) throw new Error(response.errors);

    const data = response.data as T;

    return data;
  }
}

export default MondayService;
