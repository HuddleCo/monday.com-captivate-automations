import type { ItemType } from "../types";
import { MAPPINGS, EXCLUSIONS, TYPE_EXCLUSIONS } from "./constants";

type ColumnValuesType = { [id: string]: string };

export const columnValuesForCreatingEpsiode = (
  item: ItemType
): ColumnValuesType =>
  item.column_values
    .map((element) => ({
      ...element,
      id: MAPPINGS[element.id] || element.id,
    }))
    .filter(({ id }) => !EXCLUSIONS.includes(id))
    .filter(({ type }) => !TYPE_EXCLUSIONS.includes(type))
    .reduce(
      (accumulator, { id, value }) => ({
        ...accumulator,
        [id]: JSON.parse(value),
      }),
      {}
    );
