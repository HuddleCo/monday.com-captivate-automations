import { BoardType, GroupType, ItemType } from "../types";
import MondayApi from "../mondayApi";
import { createItem } from "../mondayApi/queries/createItem";
import { cloneItemColumnsForBoard } from "./cloneItemColumnsForBoard";

export const createItemsInGroupOnBoard = async (
  client: MondayApi,
  board: BoardType,
  group: GroupType,
  items: ItemType[]
): Promise<Array<{ id: bigint }>> =>
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
