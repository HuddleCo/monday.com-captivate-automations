import { ItemType } from "../types";
import { MAPPINGS } from "./constants";

export const clientNameFor = (episode: ItemType): string =>
  episode.column_values
    .filter(({ id }) => Object.keys(MAPPINGS).includes(id))
    .find(({ text }) => text.length)?.text || "Client";
