import { BoardType, GroupType, ItemType } from "../types";
import MondayClient from "../monday-api";
import { createItem } from "../monday-api/queries/createItem";
import { cloneItemColumnsForBoard } from "./cloneItemColumnsForBoard";

export const createItemsInGroupOnBoard = async (
  client: MondayClient,
  board: BoardType,
  group: GroupType,
  items: ItemType[]
): Promise<void> => {
  Promise.all(
    items.map((item) =>
      createItem(
        client,
        board.id,
        group.id,
        item.name,
        JSON.stringify(cloneItemColumnsForBoard(item, board))
      )
    )
  );
};
