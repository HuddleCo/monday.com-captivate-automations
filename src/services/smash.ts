import { ACCEPTED_COLUMN_TYPES, EXCLUSIONS } from "../constants";
import type { BoardType, ItemType } from "../types";

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

export const smash = (item: ItemType, board: BoardType): ColumnType =>
  item.column_values
    .filter(({ type }) => ACCEPTED_COLUMN_TYPES.includes(type))
    .filter(({ id }) => !EXCLUSIONS.includes(id))
    .filter(({ title }) => !["Status"].includes(title))
    .map((columnValue) => {
      const column = board.columns.find(
        ({ title, type }) =>
          title === columnValue.title && type === columnValue.type
      );

      return column ? { [column.id]: JSON.parse(columnValue.value) } : {};
    })
    .filter((columnValue) => Object.values(columnValue)[0])
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
