import initMondayClient from "monday-sdk-js";

import type {
  ItemType,
  GroupType,
  ColumnValuesType,
  ParsedColumnValuesType,
  Response,
  GetItemsType,
  CreateItemType,
  CreateGroupType,
  OptionsType,
} from "../types";

const MAPPINGS: Record<string, string> = {
  client_name_1: "crm_1",
  connect_boards0: "connect_boards",
};

const EXCLUSIONS = ["status"];

const CRM_COLUMNS = [
  "dup__of_instragram_stories6",
  "dup__of_facebook_inkedin_videos",
  "dup__of_instragram_stories7",
  "dup__of_instagram_reels",
  "dup__of_dup__of_instagram_reels",
  "dup__of_youtube_chapters4",
];

const NOT_REQURED_LABELS = ["", "0"];

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

const getContentFor = (item: ItemType): Array<string> => {
  const contentColumnTitles = item.board.columns
    .filter(({ settings }) => {
      if (!settings) return false;
      if (!settings.displayed_column) return false;

      return Object.keys(settings.displayed_column)
        .filter((columnName) => settings.displayed_column[columnName])
        .some((columnName) => CRM_COLUMNS.includes(columnName));
    })
    .map(({ title }) => title);

  return item.column_values
    .filter(({ title }) => contentColumnTitles.includes(title))
    .filter(({ text }) => !NOT_REQURED_LABELS.includes(text))
    .map(({ title }) => title);
};

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
    const group = await this.createGroup(targetBoardId, episode.name);
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
    groupName: string
  ): Promise<GroupType> {
    const data = await this.performQuery<CreateGroupType>(
      `mutation($boardId: Int!, $groupName: String!) {
        create_group (board_id: $boardId, group_name: $groupName) {
          id
        }
      }`,
      {
        boardId,
        groupName,
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
        `mutation($boardId: Int!, $groupId: String, $content: String, $columnValues: JSON) {
          create_item (board_id: $boardId, group_id: $groupId, item_name: $content, column_values: $columnValues, create_labels_if_missing: true) {
            id
          }
        }`,
        {
          boardId,
          groupId: group.id,
          content,
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
