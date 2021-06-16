import { CLIENT_NAME_COLUMN_TITLE } from "../constants";
import type { ItemType } from "../types";

export const clientNameForEpisode = (episode: ItemType): string =>
  episode.column_values.find(
    ({ title }) => title.trim() === CLIENT_NAME_COLUMN_TITLE
  )?.text || "Client";
