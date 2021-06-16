import type { ItemType, CreateItemType } from "../types";
import { jsonColumnValues } from "./jsonColumnValues";
import { performQuery } from "./queryCounter";

export const createItem = async (
  token: string,
  boardId: number,
  groupId: string,
  itemName: string,
  item: ItemType
): Promise<void> => {
  try {
    await performQuery<CreateItemType>(
      token,
      `mutation($boardId: Int!, $groupId: String, $itemName: String, $columnValues: JSON) {
        create_item (board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues, create_labels_if_missing: true) {
          id
        }
      }`,
      {
        boardId,
        groupId,
        itemName,
        columnValues: jsonColumnValues(item),
      }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
