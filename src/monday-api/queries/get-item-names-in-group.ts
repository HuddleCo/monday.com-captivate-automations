import MondayClient from "..";
import { ItemType } from "../../types";
import { ITEM_SUBQUERY } from "./get-item";

type GetItemNamesInGroupType = {
  boards: Array<{
    groups: Array<{
      items: Array<ItemType>;
    }>;
  }>;
};

export const getItemNamesInGroup = async (
  client: MondayClient,
  boardId: number,
  groupId: string
): Promise<Array<ItemType>> =>
  (
    await client.api<GetItemNamesInGroupType>(
      `query getItemNamesInGroup($boardId: Int, $groupId: String) {
        boards (ids: [$boardId]) {
          groups (ids: [$groupId]) {
            items {
              ${ITEM_SUBQUERY}
            }
          }
        }
      }`,
      {
        boardId,
        groupId,
      }
    )
  ).boards[0]?.groups[0]?.items || [];
