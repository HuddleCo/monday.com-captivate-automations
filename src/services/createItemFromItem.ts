import { ItemType, GroupType, CreateItemType } from "../types";
import { clientNameFor } from "./clientNameFor";
import { columnValuesForCreatingEpsiode } from "./columnValuesForCreatingEpsiode";
import { executeQuery as executeQuery } from "./execute-query";

export const createItemFromItem = async (
  token: string,
  boardId: number,
  group: GroupType,
  content: string,
  episode: ItemType
): Promise<number> => {
  const columnValues = {
    ...columnValuesForCreatingEpsiode(episode),
    status_1: { label: content },
    status_17: { label: content },
  };

  const data = await executeQuery<CreateItemType>(
    token,
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
};
