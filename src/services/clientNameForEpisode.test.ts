import type { ItemType } from "../types";

import { CLIENT_NAME_COLUMN_TITLE } from "../constants";

import { clientNameForEpisode } from "./clientNameForEpisode";

const createItem = (title = "Column Title", text = "text"): ItemType => ({
  id: 1,
  name: "Item Name",
  state: "State",
  column_values: [
    {
      id: "column_id",
      value: "",
      type: "text",
      title,
      text,
    },
  ],
  board: {
    id: 2,
    name: "Board Name",
    columns: [],
    groups: [],
  },
  group: {
    id: "group_id",
    title: "Group Title",
    archived: false,
    position: 0,
  },
});

describe("clientNameForEpisode", () => {
  describe("when there are no matches", () => {
    const item = createItem();

    it("is Client", () => expect(clientNameForEpisode(item)).toBe("Client"));
  });

  describe("when the column name matches", () => {
    const text = "this is text";
    const item = createItem(CLIENT_NAME_COLUMN_TITLE, text);

    it("is the matched column text", () =>
      expect(clientNameForEpisode(item)).toBe(text));
  });
});
