import type { ItemType } from "../types";

const ARCHIVED = "archived";

export const isItemArchived = (item: ItemType): boolean =>
  item.state === ARCHIVED;
