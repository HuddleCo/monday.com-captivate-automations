import { CRM_COLUMNS } from "../constants";
import { ColumnValuesType, ItemType } from "../types";
import { episodeContents } from "./episodeContents";

const createItem = (columnValues: Array<ColumnValuesType> = []): ItemType => ({
  id: 1,
  name: "Item Name",
  state: "State",
  column_values: columnValues,
  board: {
    id: 2,
    name: "Board Name",
    columns: [
      {
        title: "Column Title",
        id: "123",
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
    ],
    groups: [],
  },
  group: {
    id: "group_id",
    title: "Group Title",
    archived: false,
    position: 0,
  },
});
describe("episodeContents", () => {
  describe("when an item has no column values", () => {
    const item = createItem([]);
    it("is empty", () => {
      expect.hasAssertions();
      expect(episodeContents(item)).toStrictEqual([]);
    });
  });

  describe('when an item column value is "0"', () => {
    const item = createItem([
      {
        id: "column_id",
        value: "",
        type: "text",
        title: "Column Title",
        text: "0",
      },
    ]);
    it("is empty", () => {
      expect.hasAssertions();
      expect(episodeContents(item)).toStrictEqual([]);
    });
  });
  describe("when an item column value is blank", () => {
    const item = createItem([
      {
        id: "column_id",
        value: "",
        type: "text",
        title: "Column Title",
        text: "",
      },
    ]);
    it("is empty", () => {
      expect.hasAssertions();
      expect(episodeContents(item)).toStrictEqual([]);
    });
  });

  describe("when an item is good", () => {
    const item = createItem([
      {
        id: "column_id",
        value: "",
        type: "text",
        title: "Column Title",
        text: "1",
      },
    ]);
    it("is Column Title", () => {
      expect.hasAssertions();
      expect(episodeContents(item)).toStrictEqual(["Column Title"]);
    });
  });
});
