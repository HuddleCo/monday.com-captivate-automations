import initMondayClient from "monday-sdk-js";

import type {
  ItemType,
  GroupType,
  ColumnValuesType,
  ParsedColumnValuesType,
} from "../types";

const MAPPINGS: Record<string, string> = {
  client_name_1: "crm_1",
  connect_boards0: "connect_boards",
};

const EXCLUSIONS = ["status"];

const columnValuesForCreatingEpsiode = (
  episode: ItemType
): ParsedColumnValuesType => ({
  ...episode.column_values
    .map((element: ColumnValuesType) => ({
      ...element,
      id: MAPPINGS[element.id] || element.id,
    }))
    .filter(({ id }) => !EXCLUSIONS.includes(id))
    .reduce(
      (accumulator, { id, value }) => ({
        ...accumulator,
        [id]: JSON.parse(value),
      }),
      {}
    ),
});

class MondayService {
  private mondayClient;

  private cachedGetItem: Record<string, ItemType>;

  private queryCounter: number;

  constructor(apiToken: string) {
    this.mondayClient = initMondayClient({ apiToken });
    this.cachedGetItem = {};
    this.queryCounter = 1;
  }

  async createContentFromEpisodeToBoard(
    episodeId: number,
    targetBoardId: number
  ): Promise<string> {
    const episode = await this.getItem(episodeId);
    const group = await this.createGroup(targetBoardId, episode.name);
    await this.createItemFromItem(targetBoardId, group, "Graphics", episode);

    return `Created content for ${episode.name}`;
  }

  private async getItem(itemId: number): Promise<ItemType> {
    if (this.cachedGetItem[itemId]) return this.cachedGetItem[itemId];

    try {
      const query = `query($itemId: [Int]) {
        items (ids: $itemId) {
          name
          column_values {
            id
            value
          }
        }
      }`;
      type Response = {
        errors?: string;
        data: {
          items: Array<ItemType>;
        };
      };
      const variables = { itemId };
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

      [this.cachedGetItem[itemId]] = response.data.items;

      return response.data.items[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async createGroup(
    boardId: number,
    groupName: string
  ): Promise<GroupType> {
    const query = `mutation($boardId: Int!, $groupName: String!) {
      create_group (board_id: $boardId, group_name: $groupName) {
        id
      }
    }`;
    const variables = { boardId, groupName };
    type Response = {
      errors?: string;
      data: {
        create_group: {
          id: number;
        };
      };
    };
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

    return { id: response.data.create_group.id };
  }

  private async createItemFromItem(
    boardId: number,
    group: GroupType,
    asset: string,
    episode: ItemType
  ): Promise<number> {
    try {
      const columnValues = {
        ...columnValuesForCreatingEpsiode(episode),
        status_1: { label: asset },
        status_17: { label: asset },
      };

      // const connectedItemColumns = await this.getItem(columnValues.connect_boards.linkedPulseIds[0].linkedPulseId).column_values;

      const query = `mutation($boardId: Int!, $groupId: String, $asset: String, $columnValues: JSON) {
        create_item (board_id: $boardId, group_id: $groupId, item_name: $asset, column_values: $columnValues) {
          id
        }
      }`;
      const variables = {
        boardId,
        groupId: group.id,
        asset,
        columnValues: JSON.stringify(columnValues),
      };

      type Response = {
        errors?: string;
        data: {
          create_item: {
            id: number;
          };
        };
      };
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

      return response.data.create_item.id;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default MondayService;
