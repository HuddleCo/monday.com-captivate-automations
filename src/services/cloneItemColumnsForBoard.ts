import dayjs from "dayjs";

import type {
  BoardType,
  ColumnValuesType,
  ItemType,
  LinkColumnType,
} from "../types";

import {
  ACCEPTED_COLUMN_TYPES,
  BOARD_RELATION_COLUMN_TYPE,
  CREATION_LOG_COLUMN_TITLE,
  DAYS_IN_PREFIX,
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

const daysInColumnIfApplicable = (board: BoardType, item: ItemType) => {
  const creationLog = item.column_values.find(({ title }) =>
    isSimilarColumnTitles(title, CREATION_LOG_COLUMN_TITLE)
  );
  const daysInColumn = board.columns.find(({ title }) =>
    isSimilarColumnTitles(title, `${DAYS_IN_PREFIX} ${item.board.name}`)
  );

  if (!daysInColumn) return {};
  if (!creationLog) return {};

  return {
    [daysInColumn.id]: Math.max(
      1,
      dayjs().diff(dayjs(creationLog.text), "day")
    ),
  };
};

export const cloneItemColumnsForBoard = (
  item: ItemType,
  board: BoardType
): ColumnType =>
  item.column_values
    .filter(({ type }) => ACCEPTED_COLUMN_TYPES.includes(type))
    .filter(({ title }) => !isSimilarColumnTitles(title, STATUS_COLUMN_TITLE))
    .map((columnValues) => matchColumns(columnValues, board))
    .reduce(
      (acc, cur) => ({ ...acc, ...cur }),
      daysInColumnIfApplicable(board, item)
    );
