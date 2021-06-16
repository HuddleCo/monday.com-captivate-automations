import { ItemType } from "../types";

export const allItemsComplete = (
  items: Array<ItemType>,
  columnId: string,
  status: string
): boolean =>
  items
    .flatMap(({ column_values }) => column_values)
    .filter(({ id }) => id === columnId)
    .every(({ text }) => text === status);
