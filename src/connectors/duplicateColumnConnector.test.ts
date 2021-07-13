import connector from "./duplicateColumnConnector";
import MondayApi from "../mondayApi";

import * as Item from "../mondayApi/queries/getItem";
import * as Update from "../mondayApi/queries/updateColumn";
import { createItem } from "../fixtures/createItem.test.fixtures";
import { createColumnValues } from "../fixtures/createColumnValue.test.fixtures";

jest.mock("../mondayApi/queries/getItem");
jest.mock("../mondayApi/queries/updateColumn");
const mockedGetItem = Item as jest.Mocked<typeof Item>;
const mockedUpdateColumn = Update as jest.Mocked<typeof Update>;

describe("duplicateMirroredColumnConnector", () => {
  const client = new MondayApi("token");

  describe("when the column matches", () => {
    const source = createColumnValues("test@example.com");
    const target = createColumnValues();

    const item = createItem([source, target]);
    const { board } = item;
    const columnId = target.id;

    beforeEach(() => {
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockResolvedValue(item);
    });

    it("displays a message with the changes made to the column", () =>
      expect(
        connector(client, board.id, item.id, columnId)
      ).resolves.toStrictEqual(
        `Copied "${source.text}" from "${source.id}" to "${target.id}"`
      ));
  });

  describe("when the source column is missing", () => {
    const column = createColumnValues();

    const item = createItem([column]);
    const { board } = item;
    const columnId = column.id;

    beforeEach(() => {
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockResolvedValue(item);
    });
    it("does nothing", () =>
      expect(
        connector(client, board.id, item.id, columnId)
      ).resolves.toStrictEqual("Could not find column. Abort"));
  });

  describe("when there are no column", () => {
    const item = createItem([]);
    const { board } = item;
    const columnId = "";

    beforeEach(() => {
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockResolvedValue(item);
    });

    it("does nothing", () =>
      expect(
        connector(client, board.id, item.id, columnId)
      ).resolves.toStrictEqual("Could not find column. Abort"));
  });

  describe("when something unexpected happens", () => {
    const source = createColumnValues("test@example.com");
    const target = createColumnValues();

    const item = createItem([source, target]);
    const { board } = item;
    const columnId = target.id;

    beforeEach(() => {
      mockedUpdateColumn.updateColumn.mockRejectedValue(
        new Error("Something bad happened")
      );
      mockedGetItem.getItem.mockResolvedValue(item);
    });

    it("throws an error", () =>
      expect(connector(client, board.id, item.id, columnId)).rejects.toThrow(
        Error
      ));
  });

  describe("when the columns have the same value", () => {
    const source = createColumnValues("test@example.com");
    const target = createColumnValues("test@example.com");

    const item = createItem([source, target]);
    const { board } = item;
    const columnId = target.id;

    beforeEach(() => {
      mockedUpdateColumn.updateColumn.mockResolvedValue({ id: item.id });
      mockedGetItem.getItem.mockResolvedValue(item);
    });

    it("says the columns are the same", () =>
      expect(
        connector(client, board.id, item.id, columnId)
      ).resolves.toStrictEqual("The column is unchanged"));
  });
});
