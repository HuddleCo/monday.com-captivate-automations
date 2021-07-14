import { createItem } from "../fixtures/createItem.test.fixtures";
import { isItemArchived } from "./isItemArchived";

describe("isItemArchived", () => {
  describe("when the state is archived", () => {
    const archivedItem = createItem({ state: "archived" });

    it("is archived", () => expect(isItemArchived(archivedItem)).toBe(true));
  });

  describe("when the state is active", () => {
    const activeItem = createItem({ state: "active" });

    it("is not archived", () => expect(isItemArchived(activeItem)).toBe(false));
  });
});
