import { isItemArchived } from "./isItemArchived";

const createItem = (state = "active") => ({
  id: 1,
  state,
  name: "Item",
  column_values: [],
  board: {
    id: 2,
    name: "Board",
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

describe("isItemArchived", () => {
  describe("when items is archived", () => {
    const archivedItem = createItem("archived");

    it("when item is archived", () =>
      expect(isItemArchived(archivedItem)).toBe(true));
  });

  describe("when items is active", () => {
    const activeItem = createItem("activeItem");

    it("when item is archived", () =>
      expect(isItemArchived(activeItem)).toBe(false));
  });
});
