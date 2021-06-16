import {
  ACCEPTED_COLUMN_TYPES,
  BOARD_RELATION_COLUMN_TYPE,
  EXCLUSIONS,
  STATUS_COLUMN_TITLE,
} from "../constants";
import type { BoardType, ColumnValuesType, ItemType } from "../types";

type DateColumnType = {
  date: number;
  icon: string;
};

type LinkedColumnType = {
  linkedPulseIds: Array<{
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
    | StatusColumnType;
};

const columnValuesConverter = ({ type, value }: ColumnValuesType) =>
  type === BOARD_RELATION_COLUMN_TYPE
    ? {
        item_ids: (JSON.parse(value) as LinkedColumnType).linkedPulseIds.map(
          ({ linkedPulseId }) => linkedPulseId
        ),
      }
    : JSON.parse(value);

export const smash = (item: ItemType, board: BoardType): ColumnType =>
  item.column_values
    .filter(({ type }) => ACCEPTED_COLUMN_TYPES.includes(type))
    .filter(({ id }) => !EXCLUSIONS.includes(id))
    .filter(({ title }) => title !== STATUS_COLUMN_TITLE)
    .map((columnValue) => {
      const column = board.columns.find(
        ({ title, type }) =>
          title === columnValue.title && type === columnValue.type
      );

      return column ? { [column.id]: columnValuesConverter(columnValue) } : {};
    })
    .filter((columnValue) => Object.values(columnValue)[0])
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
