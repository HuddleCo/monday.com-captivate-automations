import { ItemType } from "../types";

const TITLE = "Episode Name";

export const episodeName = (episode: ItemType): string =>
  episode.column_values.find(({ title }) => title === TITLE)?.text || "Episode";
