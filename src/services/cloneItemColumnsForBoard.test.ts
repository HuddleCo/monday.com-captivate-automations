import dayjs from "dayjs";
import { cloneItemColumnsForBoard } from "./cloneItemColumnsForBoard";

import { BOARD_RELATION_COLUMN_TYPE } from "../constants";

import { createItem } from "../fixtures/createItem.test.fixtures";
import { createBoard } from "../fixtures/createBoard.fixtures";

const settings = {
  relation_column: {
    col4: true,
  },
  displayed_column: {
    col4: true,
  },
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const settings_str = JSON.stringify(settings);

describe("cloneItemColumnsForBoard", () => {
  describe("when there are no columns", () => {
    const item = createItem([]);
    const board = createBoard([]);

    it("is blank", () =>
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({}));
  });

  describe("when there is 1 text column that matches", () => {
    const item = createItem([
      {
        id: "col1",
        title: "Column 1",
        value: '{"id": "text1"}',
        type: "text",
        text: "message",
      },
    ]);
    const board = createBoard([
      {
        id: "col2",
        title: "Column 1",
        type: "text",
        settings_str,
        settings,
      },
    ]);

    it("contains the matched column", () =>
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: { id: "text1" },
      }));
  });

  describe("when the item column value is null", () => {
    const item = createItem([
      {
        id: "col1",
        title: "Column 1",
        value: null,
        type: "text",
        text: "message",
      },
    ]);
    const board = createBoard([
      {
        id: "col2",
        title: "Column 1",
        type: "text",
        settings_str,
        settings,
      },
    ]);

    it("contains the matched column with a null value", () =>
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: null,
      }));
  });

  describe("when when there is matched unaccepted column type", () => {
    const item = createItem([
      {
        id: "col1",
        title: "Column 1",
        value: '{"id": "text1"}',
        type: "text",
        text: "message",
      },
      {
        id: "col1",
        title: "Column 1",
        value: '{"id": "text1"}',
        type: "unknown",
        text: "message",
      },
    ]);
    const board = createBoard([
      {
        id: "col2",
        title: "Column 1",
        type: "text",
        settings_str,
        settings,
      },
      {
        id: "col3",
        title: "Column 1",
        type: "unknown",
        settings_str,
        settings,
      },
    ]);

    it("does not include the unaccepted type", () =>
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: { id: "text1" },
      }));
  });

  describe("when there is a status column called Status", () => {
    const item = createItem([
      {
        id: "col1",
        title: "Column 1",
        value: '{"id": "text1"}',
        type: "text",
        text: "message",
      },
      {
        id: "col2",
        title: "Status",
        value: '{"id": "text1"}',
        type: "color",
        text: "message",
      },
    ]);
    const board = createBoard([
      {
        id: "col2",
        title: "Column 1",
        type: "text",
        settings_str,
        settings,
      },
      {
        id: "col3",
        title: "Status",
        type: "color",
        settings_str,
        settings,
      },
    ]);

    it("does not include the Status column", () =>
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: { id: "text1" },
      }));
  });

  describe("when there is matched connected column", () => {
    const linkedItemId = 123;
    const item = createItem([
      {
        id: "col1",
        title: "Column 1",
        value: JSON.stringify({
          linkedPulseIds: [{ linkedPulseId: linkedItemId }],
        }),
        type: BOARD_RELATION_COLUMN_TYPE,
        text: "message",
      },
    ]);
    const board = createBoard([
      {
        id: "col2",
        title: "Column 1",
        type: BOARD_RELATION_COLUMN_TYPE,
        settings_str,
        settings,
      },
    ]);

    it("contains the item_ids of the linked item ids", () =>
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: { item_ids: [linkedItemId] },
      }));
  });

  describe("when when there are no linked items in the connected board", () => {
    const item = createItem([
      {
        id: "col1",
        title: "Column 1",
        value: JSON.stringify({}),
        type: BOARD_RELATION_COLUMN_TYPE,
        text: "message",
      },
    ]);
    const board = createBoard([
      {
        id: "col2",
        title: "Column 1",
        type: BOARD_RELATION_COLUMN_TYPE,
        settings_str,
        settings,
      },
    ]);

    it("contains an empty list of linked item ids", () =>
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: {},
      }));
  });

  describe("when there is column in the board of the same title and type", () => {
    const item = createItem([
      {
        id: "col1",
        title: "Column 1",
        value: JSON.stringify({}),
        type: "text",
        text: "message",
      },
    ]);
    const board = createBoard([]);

    it("does not include the unmatched column", () =>
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({}));
  });

  describe("when the target board has a Days in column", () => {
    const item = createItem([
      {
        id: "col",
        title: "Creation Log",
        value: "",
        type: "pulse-log",
        text: dayjs().subtract(2, "days").format("YYYY-MM-DD HH:mm:ss Z"),
      },
    ]);
    const board = createBoard([
      {
        id: "col2",
        title: `Days in ${item.board.name}`,
        type: "numbers",
        settings_str,
        settings,
      },
    ]);

    it("stores the number of days since creation", () =>
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: 2,
      }));
  });

  describe("when the item does not have a creation log", () => {
    const item = createItem([]);
    const board = createBoard([
      {
        id: "col2",
        title: `Days in ${item.board.name}`,
        type: "numbers",
        settings_str,
        settings,
      },
    ]);

    it("does nothing", () =>
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({}));
  });
});
