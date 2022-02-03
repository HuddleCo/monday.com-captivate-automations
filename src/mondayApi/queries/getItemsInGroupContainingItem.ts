import { ItemType } from "../../types";
import MondayApi from "..";

type GetItemsInGroupContainingItemType = {
  boards: Array<{
    groups: Array<{
      items: Array<ItemType>;
    }>;
  }>;
};

export const getItemsInGroupContainingItem = async (
  client: MondayApi,
  item: ItemType
): Promise<Array<ItemType>> =>
  (
    await client.api<GetItemsInGroupContainingItemType>(
      `query getItemsInGroupContainingItem($boardId: Int, $groupId: String) {
        boards (ids: [$boardId]) {
          groups (ids: [$groupId]) {
            items {
              name
              column_values {
                id
                title
                value
                type
                text
              }
              board { 
                name
              }
            }
          }
        }
      }`,
      {
        boardId: BigInt(item.board.id),
        groupId: item.group.id,
      }
    )
  ).boards[0]?.groups[0]?.items || [];
