import { ItemType } from "../types";
import { CRM_COLUMNS, NOT_REQUIRED_LABELS } from "../constants";

export const episodeContents = (item: ItemType): string[] => {
  const contentColumnTitles = item.board.columns
    .filter(({ settings }) => settings.displayed_column)
    .filter(({ settings }) =>
      Object.keys(settings.displayed_column)
        .filter((columnName) => settings.displayed_column[columnName])
        .some((columnName) => CRM_COLUMNS.includes(columnName))
    )
    .map(({ title }) => title);

  return item.column_values
    .filter(({ title }) => contentColumnTitles.includes(title))
    .filter(({ text }) => !NOT_REQUIRED_LABELS.includes(text))
    .map(({ title }) => title);
};
