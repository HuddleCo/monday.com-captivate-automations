import { ItemType } from "../types";
import { columnValuesForCreatingEpsiode } from "./column-values-for-creating-epsiode";

export const jsonColumnValues = (item: ItemType): string =>
  JSON.stringify(columnValuesForCreatingEpsiode(item));
