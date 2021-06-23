import { NOT_REQURED_LABELS, PODCAST_COLUMN_TITLE } from "../constants";
import { ItemType } from "../types";

export const podcastIsNotRequired = (item: ItemType): boolean => {
  const podcastColumnValue =
    item.column_values.find(({ title }) => title === PODCAST_COLUMN_TITLE)
      ?.text || "";

  return NOT_REQURED_LABELS.includes(podcastColumnValue);
};
