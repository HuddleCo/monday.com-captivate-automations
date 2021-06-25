import { cloneItemColumnsForBoard } from "./clone-item-columns-for-board";

import type { BoardColumnsType, ColumnValuesType } from "../types";
import { BOARD_RELATION_COLUMN_TYPE } from "../constants";

const creatItem = (column_values: Array<ColumnValuesType>) => ({
  id: 1,
  name: "Sample",
  state: "active",
  column_values,
  board: {
    id: 2,
    name: "Board",
    columns: [],
    groups: [],
  },
  group: {
    id: "group_id",
    title: "Group Title",
    position: 0,
    archived: false,
  },
});

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

const createBoard = (columns: Array<BoardColumnsType>) => ({
  id: 3,
  name: "Other Board",
  columns,
  groups: [],
});

describe("cloneItemColumnsForBoard", () => {
  describe("when there are no columns", () => {
    const item = creatItem([]);
    const board = createBoard([]);

    it("is blank", () => {
      expect.hasAssertions();
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({});
    });
  });

  describe("when there is 1 text column that matches", () => {
    const item = creatItem([
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

    it("contains the matched column", () => {
      expect.hasAssertions();
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: { id: "text1" },
      });
    });
  });

  describe("when the item column value is null", () => {
    const item = creatItem([
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

    it("contains the matched column with a null value", () => {
      expect.hasAssertions();
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: null,
      });
    });
  });

  describe("when when there is matched unaccepted column type", () => {
    const item = creatItem([
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

    it("does not include the unaccepted type", () => {
      expect.hasAssertions();
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: { id: "text1" },
      });
    });
  });

  describe("when there is a status column called Status", () => {
    const item = creatItem([
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

    it("does not include the Status column", () => {
      expect.hasAssertions();
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: { id: "text1" },
      });
    });
  });

  describe("when there is matched connected column", () => {
    const linkedItemId = 123;
    const item = creatItem([
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

    it("contains the item_ids of the linked item ids", () => {
      expect.hasAssertions();
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: { item_ids: [linkedItemId] },
      });
    });
  });

  describe("when when there are no linked items in the connected board", () => {
    const item = creatItem([
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

    it("contains an empty list of linked item ids", () => {
      expect.hasAssertions();
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({
        col2: {},
      });
    });
  });

  describe("when there is column in the board of the same title and type", () => {
    const item = creatItem([
      {
        id: "col1",
        title: "Column 1",
        value: JSON.stringify({}),
        type: "text",
        text: "message",
      },
    ]);
    const board = createBoard([]);

    it("does not include the unmatched column", () => {
      expect.hasAssertions();
      expect(cloneItemColumnsForBoard(item, board)).toStrictEqual({});
    });
  });
});
