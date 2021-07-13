/* eslint-disable jest/no-test-return-statement */
import connector from "./duplicateColumnConnector";
import MondayClient from "../monday-api";
import type { ColumnValuesType } from "../types";

import * as Item from "../monday-api/queries/getItem";
import * as Update from "../monday-api/queries/updateColumn";

jest.mock("../monday-api/queries/getItem");
jest.mock("../monday-api/queries/updateColumn");
const mockedGetItem = Item as jest.Mocked<typeof Item>;
const mockedUpdateColumn = Update as jest.Mocked<typeof Update>;

const createItem = (columnVales: Array<ColumnValuesType>) => ({
  id: 2,
  name: "Item Name",
  state: "active",
  column_values: columnVales,
  board: {
    id: 1,
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

describe("duplicateMirroredColumnConnector", () => {
  const client = new MondayClient("token");

  describe("when the column matches", () => {
    const source = {
      id: "col1",
      title: "Title",
      value: "{}",
      type: "",
      text: "test@example.com",
    };

    const target = {
      id: "col2",
      title: "Title",
      value: "{}",
      type: "",
      text: "",
    };

    const item = createItem([source, target]);
    const { board } = item;
    const columnId = target.id;

    it("gets the item", () => {
      expect.hasAssertions();
      mockedUpdateColumn.updateColumn.mockClear();
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockClear();
      mockedGetItem.getItem.mockResolvedValue(item);

      return connector(client, board.id, item.id, columnId).then(() =>
        expect(mockedGetItem.getItem).toHaveBeenCalledWith(client, item.id)
      );
    });

    it("updates the column", () => {
      expect.hasAssertions();
      mockedUpdateColumn.updateColumn.mockClear();
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockClear();
      mockedGetItem.getItem.mockResolvedValue(item);

      return connector(client, board.id, item.id, columnId).then(() =>
        expect(mockedUpdateColumn.updateColumn).toHaveBeenCalledWith(
          client,
          board.id,
          item.id,
          columnId,
          source.text
        )
      );
    });

    it("displays a message with the changes made to the column", () => {
      expect.hasAssertions();
      mockedUpdateColumn.updateColumn.mockClear();
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockClear();
      mockedGetItem.getItem.mockResolvedValue(item);

      return expect(
        connector(client, board.id, item.id, columnId)
      ).resolves.toStrictEqual(
        `Copied "${source.text}" from "${source.id}" to "${target.id}"`
      );
    });
  });

  describe("when the source column is missing", () => {
    const column = {
      id: "col2",
      title: "Title",
      value: "{}",
      type: "",
      text: "",
    };

    const item = createItem([column]);
    const { board } = item;
    const columnId = column.id;

    it("does nothing", () => {
      expect.hasAssertions();
      mockedUpdateColumn.updateColumn.mockClear();
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockClear();
      mockedGetItem.getItem.mockResolvedValue(item);

      return expect(
        connector(client, board.id, item.id, columnId)
      ).resolves.toStrictEqual("Could not find column. Abort");
    });

    it("does not updates the column", () => {
      expect.hasAssertions();
      mockedUpdateColumn.updateColumn.mockClear();
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockClear();
      mockedGetItem.getItem.mockResolvedValue(item);

      return connector(client, board.id, item.id, columnId).then(() =>
        expect(mockedUpdateColumn.updateColumn).not.toHaveBeenCalled()
      );
    });
  });

  describe("when there are no column", () => {
    const item = createItem([]);
    const { board } = item;
    const columnId = "";

    it("does nothing", () => {
      expect.hasAssertions();
      mockedUpdateColumn.updateColumn.mockClear();
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockClear();
      mockedGetItem.getItem.mockResolvedValue(item);

      return expect(
        connector(client, board.id, item.id, "col")
      ).resolves.toStrictEqual("Could not find column. Abort");
    });

    it("does not updates the column", () => {
      expect.hasAssertions();
      mockedUpdateColumn.updateColumn.mockClear();
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockClear();
      mockedGetItem.getItem.mockResolvedValue(item);

      return connector(client, board.id, item.id, columnId).then(() =>
        expect(mockedUpdateColumn.updateColumn).not.toHaveBeenCalled()
      );
    });
  });

  describe("when something unexpected happens", () => {
    const source = {
      id: "col1",
      title: "Title",
      value: "{}",
      type: "",
      text: "test@example.com",
    };

    const target = {
      id: "col2",
      title: "Title",
      value: "{}",
      type: "",
      text: "",
    };

    const item = createItem([source, target]);
    const { board } = item;
    const columnId = target.id;

    it("does nothing", () => {
      expect.hasAssertions();
      mockedUpdateColumn.updateColumn.mockClear();
      mockedUpdateColumn.updateColumn.mockRejectedValue(
        new Error("Something bad happened")
      );
      mockedGetItem.getItem.mockClear();
      mockedGetItem.getItem.mockResolvedValue(item);

      return expect(
        connector(client, board.id, item.id, columnId)
      ).rejects.toThrow(Error);
    });
  });

  describe("when the columns have the same value", () => {
    const source = {
      id: "col1",
      title: "Title",
      value: "{}",
      type: "",
      text: "test@example.com",
    };

    const target = {
      id: "col2",
      title: "Title",
      value: "{}",
      type: "",
      text: "test@example.com",
    };

    const item = createItem([source, target]);
    const { board } = item;
    const columnId = target.id;

    it("says the columns are the same", () => {
      expect.hasAssertions();
      mockedUpdateColumn.updateColumn.mockClear();
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockClear();
      mockedGetItem.getItem.mockResolvedValue(item);

      return expect(
        connector(client, board.id, item.id, columnId)
      ).resolves.toStrictEqual("The column is unchanged");
    });

    it("does not updates the column", () => {
      expect.hasAssertions();
      mockedUpdateColumn.updateColumn.mockClear();
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockClear();
      mockedGetItem.getItem.mockResolvedValue(item);

      return connector(client, board.id, item.id, columnId).then(() =>
        expect(mockedUpdateColumn.updateColumn).not.toHaveBeenCalled()
      );
    });
  });
});
