import { expect } from "chai";
import { isItemArchived } from "./is-item-archived";

describe("isItemArchived", () => {
  context("when the item is archved", () => {
    const item = {
      id: 1,
      state: "archived",
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
      },
    };

    it("is true", () => expect(isItemArchived(item)).equal(true));
  });
});
