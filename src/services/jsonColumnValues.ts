import { ItemType } from "../types";
import { columnValuesForCreatingEpsiode } from "./columnValuesForCreatingEpsiode";

export const jsonColumnValues = (item: ItemType): string =>
  JSON.stringify(columnValuesForCreatingEpsiode(item));
