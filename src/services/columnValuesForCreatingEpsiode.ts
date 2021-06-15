import { ItemType, ColumnValuesType, ParsedColumnValuesType } from "../types";
import { MAPPINGS, EXCLUSIONS } from "./constants";

const TYPE_EXCLUSIONS = ["formula", "lookup", "pulse-log"];

export const columnValuesForCreatingEpsiode = (
  episode: ItemType
): ParsedColumnValuesType => ({
  ...episode.column_values
    .map((element: ColumnValuesType) => ({
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
    ),
});
