import { ItemType } from "../types";
import { CRM_COLUMNS, NOT_REQURED_LABELS } from "../constants";

export const getContentForEpisode = (item: ItemType): Array<string> => {
  const contentColumnTitles = item.board.columns
    .filter(({ settings }) => {
      if (!settings) return false;
      if (!settings.displayed_column) return false;

      return Object.keys(settings.displayed_column)
        .filter((columnName) => settings.displayed_column[columnName])
        .some((columnName) => CRM_COLUMNS.includes(columnName));
    })
    .map(({ title }) => title);

  return item.column_values
    .filter(({ title }) => contentColumnTitles.includes(title))
    .filter(({ text }) => !NOT_REQURED_LABELS.includes(text))
    .map(({ title }) => title);
};
