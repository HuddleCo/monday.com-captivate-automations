import type { BoardType, ColumnValuesType, ItemType } from "../types";

import { createBoard } from "./createBoard.fixtures";

let id = 0;

export const createItem = ({
  column_values = [],
  state = "active",
  board = createBoard([]),
}: {
  column_values?: Array<ColumnValuesType>;
  state?: string;
  board?: BoardType;
}): ItemType => {
  id += 1;
  return {
    id,
    name: "Item Name",
    state,
    column_values,
    board,
    group: {
      id: "group_id",
      title: "Group Title",
      archived: false,
      position: 0,
    },
  };
};
