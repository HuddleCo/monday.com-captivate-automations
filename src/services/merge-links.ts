import type { ItemType, LinkColumnType } from "../types";
import {
  ASSET_TYPE_COLUMN_TITLE,
  CONTENT_LINK_COLUMN_TITLE,
} from "../constants";

export const mergeLinks = (items: Array<ItemType>): string =>
  items
    .map(({ column_values }) => ({
      contentType:
        column_values.find(({ title }) => title === ASSET_TYPE_COLUMN_TITLE)
          ?.text || "Content",
      contentLink: (
        JSON.parse(
          column_values.find(({ title }) => title === CONTENT_LINK_COLUMN_TITLE)
            ?.value || '{"url":""}'
        ) as LinkColumnType
      ).url.trim(),
    }))
    .map(({ contentType, contentLink }) => `${contentType}:\n${contentLink}`)
    .join("\n\n");
