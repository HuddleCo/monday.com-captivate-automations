import { podcastIsNotRequired } from "./podcastIsNotRequired";

import { createItem } from "../fixtures/createItem.test.fixtures";
import { createColumnValues } from "../fixtures/createColumnValue.test.fixtures";

describe("podcastIsNotRequired", () => {
  describe("when the item does not have a Podcast column", () => {
    const item = createItem({});

    it("is not required for a podcast", () =>
      expect(podcastIsNotRequired(item)).toBe(true));
  });

  describe("when the item does has a blank Podcast column", () => {
    const column = createColumnValues("", "Podcasts");
    const item = createItem({ column_values: [column] });

    it("is not required for a podcast", () =>
      expect(podcastIsNotRequired(item)).toBe(true));
  });

  describe("when the item Podcast column has the value 1", () => {
    const column = createColumnValues("1", "Podcasts");
    const item = createItem({ column_values: [column] });

    it("is required for a podcast", () =>
      expect(podcastIsNotRequired(item)).toBe(false));
  });
});
