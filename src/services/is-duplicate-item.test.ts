import { ItemType } from "../types";
import { isDuplicateItem } from "./is-duplicate-item";

const createItem = (name = "Item Name"): ItemType => ({
  id: 1,
  name,
  state: "State",
  column_values: [],
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

describe("isDuplicateItem", () => {
  describe("when there are no items", () => {
    const items: ItemType[] = [];
    const item = createItem();
    it("has no duplicates", () => {
      expect.hasAssertions();
      expect(isDuplicateItem(items, item)).toBe(false);
    });
  });
  describe("when there is 1 different item", () => {
    const items = [createItem("different")];
    const item = createItem("same");
    it("has no duplicates", () => {
      expect.hasAssertions();
      expect(isDuplicateItem(items, item)).toBe(false);
    });
  });

  describe("when there is 1 duplicate item", () => {
    const item = createItem();
    const items = [item];
    it("has no duplicates", () => {
      expect.hasAssertions();
      expect(isDuplicateItem(items, item)).toBe(true);
    });
  });
});
