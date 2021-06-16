import { jsonColumnValues } from "../../services/json-column-values";
import MondayClient from "..";
import type { ItemType } from "../../types";

type CreateItemType = {
  create_item: {
    id: number;
  };
};

export const createItem = async (
  client: MondayClient,
  boardId: number,
  groupId: string,
  itemName: string,
  item: ItemType
): Promise<CreateItemType> =>
  client.api<CreateItemType>(
    `mutation createItem($boardId: Int!, $groupId: String, $itemName: String, $columnValues: JSON) {
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
