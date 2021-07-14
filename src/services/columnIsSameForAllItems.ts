import { ItemType } from "../types";

export const columnIsSameForAllItems = (
  items: Array<ItemType>,
  columnId: string,
  status: string
): boolean => {
  if (!items.length) return false;

  return items
    .flatMap(({ column_values }) => column_values)
    .filter(({ id }) => id === columnId)
    .every(({ text }) => text === status);
};
