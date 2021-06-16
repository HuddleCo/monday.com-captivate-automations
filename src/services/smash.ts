import { utimes } from "fs";
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

type LinkColumnType = {
  url: string;
  text: string;
  changed_at: string;
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

const columnValuesConverter = ({ type, value }: ColumnValuesType) =>
  type === BOARD_RELATION_COLUMN_TYPE
    ? {
        item_ids: (JSON.parse(value) as LinkedColumnType).linkedPulseIds.map(
          ({ linkedPulseId }) => linkedPulseId
        ),
      }
    : JSON.parse(value);

const mergeContentLinks = (items: Array<ItemType>): string =>
  items
    .map(({ column_values }) => ({
      contentType:
        column_values.find(({ title }) => title === "Asset Type")?.text ||
        "Content",
      contentLink: (
        JSON.parse(
          column_values.find(({ title }) => title === "Content Link")?.value ||
            '{"url":""}'
        ) as LinkColumnType
      ).url.trim(),
    }))
    .map(({ contentType, contentLink }) => `${contentType}:\n${contentLink}`)
    .join("\n\n");

export const smash = (items: Array<ItemType>, board: BoardType): ColumnType => {
  if (!items.length) return {};

  return items[0].column_values
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
    .reduce((acc, cur) => ({ ...acc, ...cur }), {
      content_links: { text: mergeContentLinks(items) },
    });
};
