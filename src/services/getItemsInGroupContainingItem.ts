import { ItemType, GetItemsInGroupContainingItemType } from "../types";
import { performQuery } from "./queryCounter";

export const getItemsInGroupContainingItem = async (
  token: string,
  item: ItemType
): Promise<Array<ItemType>> => {
  try {
    const data = await performQuery<GetItemsInGroupContainingItemType>(
      token,
      `query($boardId: Int, $groupId: String) {
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
            }
          }
        }
      }`,
      {
        boardId: Number(item.board.id),
        groupId: item.group.id,
      }
    );

    return data.boards[0].groups[0].items;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
