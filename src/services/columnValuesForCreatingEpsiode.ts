import type { ItemType, ParsedColumnValuesType } from "../types";
import { MAPPINGS, EXCLUSIONS, TYPE_EXCLUSIONS } from "./constants";

export const columnValuesForCreatingEpsiode = (
  item: ItemType
): ParsedColumnValuesType =>
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
