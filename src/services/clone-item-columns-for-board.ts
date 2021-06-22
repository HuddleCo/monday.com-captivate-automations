import {
  ACCEPTED_COLUMN_TYPES,
  BOARD_RELATION_COLUMN_TYPE,
  STATUS_COLUMN_TITLE,
} from "../constants";
import type {
  BoardType,
  ColumnValuesType,
  ItemType,
  LinkColumnType,
} from "../types";

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

const columnValuesConverter = ({ type, value }: ColumnValuesType) => {
  if (type === BOARD_RELATION_COLUMN_TYPE) {
    const data = JSON.parse(value) as LinkedColumnType;
    const itemIds = data.linkedPulseIds
      ? data.linkedPulseIds.map(({ linkedPulseId }) => linkedPulseId)
      : [];

    return { item_ids: itemIds };
  }

  return JSON.parse(value);
};

export const cloneItemColumnsForBoard = (
  item: ItemType,
  board: BoardType
): ColumnType =>
  item.column_values
    .filter(({ type }) => ACCEPTED_COLUMN_TYPES.includes(type))
    .filter(({ title }) => title.trim() !== STATUS_COLUMN_TITLE)
    .map((columnValue) => {
      const column = board.columns.find(
        ({ title, type }) =>
          title.trim() === columnValue.title.trim() && type === columnValue.type
      );

      return column ? { [column.id]: columnValuesConverter(columnValue) } : {};
    })
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
