import type {
  BoardType,
  ColumnValuesType,
  ItemType,
  LinkColumnType,
} from "../types";

import {
  ACCEPTED_COLUMN_TYPES,
  BOARD_RELATION_COLUMN_TYPE,
  STATUS_COLUMN_TITLE,
} from "../constants";

import { isSimilarColumnTitles } from "./isSimilarColumnTitle";

type DateColumnType = {
  date: number;
  icon: string;
};

type LinkedColumnType = {
  linkedPulseIds?: Array<{
    linkedPulseId: number;
  }>;
};

type StatusColumnType = {
  index: number;
};

type ColumnType = {
  [id: string]:
    | null
    | string
    | DateColumnType
    | LinkedColumnType
    | LinkColumnType
    | StatusColumnType;
};

const boardRelationColumn = (value: string) => {
  const { linkedPulseIds } = JSON.parse(value) as LinkedColumnType;
  if (!linkedPulseIds) return {};

  return { item_ids: linkedPulseIds.map(({ linkedPulseId }) => linkedPulseId) };
};

const columnValuesConverter = ({ type, value }: ColumnValuesType) => {
  if (!value) return null;
  if (type === BOARD_RELATION_COLUMN_TYPE) return boardRelationColumn(value);

  return JSON.parse(value);
};

const matchColumns = (columnValue: ColumnValuesType, board: BoardType) => {
  const column = board.columns.find(
    ({ title, type }) =>
      isSimilarColumnTitles(title, columnValue.title) &&
      type === columnValue.type
  );

  if (!column) return {};

  return { [column.id]: columnValuesConverter(columnValue) };
};

export const cloneItemColumnsForBoard = (
  item: ItemType,
  board: BoardType
): ColumnType =>
  item.column_values
    .filter(({ type }) => ACCEPTED_COLUMN_TYPES.includes(type))
    .filter(({ title }) => !isSimilarColumnTitles(title, STATUS_COLUMN_TITLE))
    .map((columnValues) => matchColumns(columnValues, board))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
