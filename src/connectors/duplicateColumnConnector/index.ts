import MondayApi from "../../mondayApi";

import type { ColumnValuesType, ItemType } from "../../types";

import UnmatchedColumnError from "./unmatchedColumnError";

import { getItem } from "../../mondayApi/queries/getItem";
import { updateColumn } from "../../mondayApi/queries/updateColumn";

const getTarget = (item: ItemType, columnId: string): ColumnValuesType => {
  const column = item.column_values.find(({ id }) => id === columnId);
  if (!column) throw new UnmatchedColumnError();
  return column;
};

const getSource = (item: ItemType, columnId: string): ColumnValuesType => {
  const targetColumn = getTarget(item, columnId);
  const column = item.column_values
    .filter(({ id }) => id !== targetColumn.id)
    .find(({ title }) => title === targetColumn.title);

  if (!column) throw new UnmatchedColumnError();
  return column;
};

const getColumnPair = (item: ItemType, columnId: string) => ({
  target: getTarget(item, columnId),
  source: getSource(item, columnId),
});

const getColumns = (client: MondayApi, itemId: bigint, columnId: string) =>
  getItem(client, itemId).then((item) => getColumnPair(item, columnId));

export default (
  client: MondayApi,
  boardId: bigint,
  itemId: bigint,
  columnId: string
): Promise<string> =>
  getColumns(client, itemId, columnId)
    .then(({ source, target }) =>
      source.text === target.text
        ? "The column is unchanged"
        : updateColumn(client, boardId, itemId, columnId, source.text).then(
          () =>
            `Copied "${source.text}" from "${source.id}" to "${target.id}"`
        )
    )
    .catch((error) => {
      if (error instanceof UnmatchedColumnError) return error.message;

      throw error;
    });
