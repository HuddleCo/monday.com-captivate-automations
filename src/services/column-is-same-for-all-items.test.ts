import { ItemType } from "../types";
import { columnIsSameForAllItems } from "./column-is-same-for-all-items";

const createItem = (columnId = "col", text = "text"): ItemType => ({
  id: 1,
  name: "Item Name",
  state: "State",
  column_values: [
    {
      id: columnId,
      value: "",
      type: "text",
      title: "Column Title",
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
describe("columnIsSameForAllItems", () => {
  describe("when there are items", () => {
    it("is false", () => {
      expect.hasAssertions();
      expect(columnIsSameForAllItems([], "col", "status")).toBe(false);
    });
  });

  describe("when an item has a different value for the column", () => {
    const sameItem = createItem("col_text", "text");
    const differentItem = createItem("col_text", "example text");
    it("is false", () => {
      expect.hasAssertions();
      expect(
        columnIsSameForAllItems([sameItem, differentItem], "col_text", "text")
      ).toBe(false);
    });
  });

  describe("when all items have the same value for a column", () => {
    const sameItem = createItem("col_text", "text");
    it("is false", () => {
      expect.hasAssertions();
      expect(
        columnIsSameForAllItems([sameItem, sameItem], "col_text", "text")
      ).toBe(true);
    });
  });
});
