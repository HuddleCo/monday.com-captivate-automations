import { ItemType, GetItemsType } from "../types";
import { performQuery } from "./queryCounter";

const cachedGetItem: Record<number, ItemType> = {};
export const getItem = async (
  token: string,
  itemId: number
): Promise<ItemType> => {
  if (cachedGetItem[itemId]) return cachedGetItem[itemId];

  try {
    const data = await performQuery<GetItemsType>(
      token,
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
            id
            columns {
              id
              title
              type
              settings_str
            }
          }
          group {
            id
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

    cachedGetItem[itemId] = item;

    return item;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
