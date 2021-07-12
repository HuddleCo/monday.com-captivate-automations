import MondayClient from "../monday-api";

import type { ColumnValuesType, ItemType } from "../types";

import UnmatchedColumnError from "../errors/unmatched-column-error";

import { getItem } from "../monday-api/queries/get-item";
import { updateColumn } from "../monday-api/queries/update-column";

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

const getColumns = (client: MondayClient, itemId: number, columnId: string) =>
  getItem(client, itemId).then((item) => getColumnPair(item, columnId));

export default (
  client: MondayClient,
  boardId: number,
  itemId: number,
  columnId: string
): Promise<string> =>
  getColumns(client, itemId, columnId)
    .then(({ source, target }) =>
      source.text === target.text
        ? "The column is unchanged"
        : updateColumn(
            client,
            boardId,
            itemId,
            columnId,
            source.text || ""
          ).then(
            () =>
              `Copied "${source.text}" from "${source.id}" to "${target.id}"`
          )
    )
    .catch((error) => {
      if (error instanceof UnmatchedColumnError)
        return "Could not find column. Abort";

      throw error;
    });
