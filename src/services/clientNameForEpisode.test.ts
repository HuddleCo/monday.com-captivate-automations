import { CLIENT_NAME_COLUMN_TITLE } from "../constants";
import { createItem } from "../fixtures/createItem.test.fixtures";

import { clientNameForEpisode } from "./clientNameForEpisode";

describe("clientNameForEpisode", () => {
  describe("when there are no matches", () => {
    const item = createItem({});

    it("is Client", () => expect(clientNameForEpisode(item)).toBe("Client"));
  });

  describe("when the column name matches", () => {
    const text = "this is text";
    const item = createItem({
      column_values: [
        {
          id: "column_id",
          value: "",
          type: "text",
          title: CLIENT_NAME_COLUMN_TITLE,
          text,
        },
      ],
    });

    it("is the matched column text", () =>
      expect(clientNameForEpisode(item)).toBe(text));
  });
});
