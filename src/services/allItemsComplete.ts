import { ItemType } from "../types";

export const allItemsComplete = (
  items: Array<ItemType>,
  columnId: string,
  status: string
): boolean =>
  items
    .map(({ column_values }) =>
      column_values
        .filter(({ id }) => id === columnId)
        .map(({ text }) => text === status)
    )
    .reduce((acc, val) => acc.concat(val), [])
    .every((val) => val === true);
