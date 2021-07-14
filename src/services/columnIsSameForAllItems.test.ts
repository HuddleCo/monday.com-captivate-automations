import { createItem } from "../fixtures/createItem.test.fixtures";
import { columnIsSameForAllItems } from "./columnIsSameForAllItems";

describe("columnIsSameForAllItems", () => {
  describe("when there are items", () => {
    it("is false", () =>
      expect(columnIsSameForAllItems([], "col", "status")).toBe(false));
  });

  describe("when an item has a different value for the column", () => {
    const sameItem = createItem({
      column_values: [
        {
          id: "col_text",
          value: "",
          type: "text",
          title: "Column Title",
          text: "text",
        },
      ],
    });
    const differentItem = createItem({
      column_values: [
        {
          id: "col_text",
          value: "",
          type: "text",
          title: "Column Title",
          text: "example text",
        },
      ],
    });

    it("is false", () =>
      expect(
        columnIsSameForAllItems([sameItem, differentItem], "col_text", "text")
      ).toBe(false));
  });

  describe("when all items have the same value for a column", () => {
    const sameItem = createItem({
      column_values: [
        {
          id: "col_text",
          value: "",
          type: "text",
          title: "Column Title",
          text: "text",
        },
      ],
    });

    it("is false", () =>
      expect(
        columnIsSameForAllItems([sameItem, sameItem], "col_text", "text")
      ).toBe(true));
  });
});
