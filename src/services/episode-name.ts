import { EPISODE_NAME_COLUMN_TITLE } from "../constants";
import { ItemType } from "../types";

export const episodeName = (episode: ItemType): string =>
  episode.column_values.find(
    ({ title }) => title.trim() === EPISODE_NAME_COLUMN_TITLE
  )?.text || "Episode";
