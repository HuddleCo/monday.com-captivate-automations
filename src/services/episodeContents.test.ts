import { CRM_COLUMNS } from "../constants";
import { episodeContents } from "./episodeContents";
import { createItem } from "../fixtures/createItem.test.fixtures";
import { createBoard } from "../fixtures/createBoard.fixtures";

describe("episodeContents", () => {
  describe("when an item has no column values", () => {
    const item = createItem({});
    it("is empty", () => expect(episodeContents(item)).toStrictEqual([]));
  });

  describe('when an item column value is "0"', () => {
    const item = createItem({
      column_values: [
        {
          id: "column_id",
          value: "",
          type: "text",
          title: "Column Title",
          text: "0",
        },
      ],
    });

    it("is empty", () => expect(episodeContents(item)).toStrictEqual([]));
  });
  describe("when an item column value is blank", () => {
    const item = createItem({
      column_values: [
        {
          id: "column_id",
          value: "",
          type: "text",
          title: "Column Title",
          text: "",
        },
      ],
    });

    it("is empty", () => expect(episodeContents(item)).toStrictEqual([]));
  });

  describe("when an item is good", () => {
    const item = createItem({
      column_values: [
        {
          id: "column_id",
          value: "",
          type: "text",
          title: "Column Title",
          text: "1",
        },
      ],
      board: createBoard([
        {
          id: "123",
          title: "Column Title",
          settings_str: "",
          type: "text",
          settings: {
            displayed_column: {
              [CRM_COLUMNS[0]]: true,
            },
            relation_column: {
              [CRM_COLUMNS[0]]: true,
            },
          },
        },
      ]),
    });

    it("is Column Title", () =>
      expect(episodeContents(item)).toStrictEqual(["Column Title"]));
  });
});
