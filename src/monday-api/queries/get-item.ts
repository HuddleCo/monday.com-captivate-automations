import { ItemType } from "../../types";
import MondayClient from "..";
import { BOARD_SUBQUERY } from "./get-board";

type GetItemsType = {
  items: Array<ItemType>;
};

export const getItem = async (
  client: MondayClient,
  itemId: number
): Promise<ItemType> => {
  const data = await client.api<GetItemsType>(
    `query getItem($itemId: [Int]) {
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
            ${BOARD_SUBQUERY}
          }
          group {
            id
            title
            archived
          }
        }
      }`,
    {
      itemId,
    }
  );

  const item = data.items[0];
  item.id = itemId;
  item.board.columns = item.board.columns.map((column) => ({
    ...column,
    settings: JSON.parse(column.settings_str),
  }));
  item.board.id = Number(item.board.id);

  return item;
};
