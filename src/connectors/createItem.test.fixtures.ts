import type { ColumnValuesType, ItemType } from "../types";

let id = 0;

export const createItem = (columnVales: Array<ColumnValuesType>): ItemType => {
  id += 1;
  return {
    id,
    name: "Item Name",
    state: "active",
    column_values: columnVales,
    board: {
      id: 1,
      name: "Board Name",
      columns: [],
      groups: [],
    },
    group: {
      id: "group_id",
      title: "Group Title",
      archived: false,
      position: 0,
    },
  };
};
