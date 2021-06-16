import type { ItemType, GroupType } from "../../types";
import { clientNameFor } from "../../services/clientNameFor";
import { columnValuesForCreatingEpsiode } from "../../services/columnValuesForCreatingEpsiode";
import MondayClient from "..";

type CreateItemType = {
  create_item: {
    id: number;
  };
};

export const createItemFromItem = async (
  client: MondayClient,
  boardId: number,
  group: GroupType,
  content: string,
  episode: ItemType
): Promise<number> =>
  (
    await client.api<CreateItemType>(
      `mutation($boardId: Int!, $groupId: String, $itemName: String, $columnValues: JSON) {
        create_item (board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues, create_labels_if_missing: true) {
          id
        }
      }`,
      {
        boardId,
        groupId: group.id,
        itemName: `${content} - ${clientNameFor(episode)}`,
        columnValues: JSON.stringify({
          ...columnValuesForCreatingEpsiode(episode),
          status_1: { label: content },
          status_17: { label: content },
        }),
      }
    )
  ).create_item.id;
