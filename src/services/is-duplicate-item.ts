import { ItemType } from "../types";

export const isDuplicateItem = (
  items: Array<ItemType>,
  item: ItemType
): boolean => !!items.find(({ name }) => name === item.name);
