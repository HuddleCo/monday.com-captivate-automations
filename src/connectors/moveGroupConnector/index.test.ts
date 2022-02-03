import connector from ".";
import MondayApi from "../../mondayApi";

import * as GetItem from "../../mondayApi/queries/getItem";
import * as GetItemsInGroupContainingItem from "../../mondayApi/queries/getItemsInGroupContainingItem";
import * as ArchiveGroup from "../../mondayApi/queries/archiveGroup";
import * as GetBoard from "../../mondayApi/queries/getBoard";
import { BoardType, GroupType, ItemType } from "../../types";

jest.mock("../../mondayApi/queries/archiveGroup");
jest.mock("../../mondayApi/queries/getItem");
jest.mock("../../mondayApi/queries/getItemsInGroupContainingItem");
jest.mock("../../mondayApi/queries/getBoard");
const mockedGetItem = GetItem as jest.Mocked<typeof GetItem>;
const mockedGetItemsInGroupContainingItem =
  GetItemsInGroupContainingItem as jest.Mocked<
    typeof GetItemsInGroupContainingItem
  >;
const mockedArchiveGroup = ArchiveGroup as jest.Mocked<typeof ArchiveGroup>;
const mockedGetBoard = GetBoard as jest.Mocked<typeof GetBoard>;

describe("moveGroupConnector", () => {
  const client = new MondayApi("token");

  describe("when there are no errors", () => {
    const itemId = 123n;
    const statusColumnId = "1234";
    const status = "complete";
    const boardId = 321n;

    const archiveGroup: GroupType = {
      id: "321",
      title: "Test",
      archived: false,
      position: 0,
    };

    const items: ItemType[] = [
      {
        id: 0n,
        name: "",
        state: "",
        column_values: [],
        board: {
          id: 0n,
          name: "",
          columns: [],
          groups: [],
        },
        group: {
          id: "",
          title: "",
          archived: false,
          position: 0,
        },
      },
    ];

    const item: ItemType = {
      id: 0n,
      name: "",
      state: "",
      column_values: [],
      board: {
        id: 0n,
        name: "",
        columns: [],
        groups: [],
      },
      group: {
        id: "",
        title: "sample",
        archived: false,
        position: 0,
      },
    };

    const board: BoardType = {
      id: 0n,
      name: "",
      columns: [],
      groups: [
        {
          id: "",
          title: "sample",
          archived: false,
          position: 0,
        },
      ],
    };

    beforeEach(() => {
      mockedGetItem.getItem.mockResolvedValue(item);
      mockedGetItemsInGroupContainingItem.getItemsInGroupContainingItem.mockResolvedValue(
        items
      );
      mockedArchiveGroup.archiveGroup.mockResolvedValue(archiveGroup);
      mockedGetBoard.getBoard.mockResolvedValue(board);
    });

    xit("works", () =>
      expect(
        connector(client, itemId, statusColumnId, status, boardId)
      ).resolves.toBe(true));
  });

  describe("when the group is archived", () => {
    const itemId = 123n;
    const statusColumnId = "1234";
    const status = "complete";
    const boardId = 321n;

    const archiveGroup: GroupType = {
      id: "321",
      title: "Test",
      archived: true,
      position: 0,
    };

    const items: ItemType[] = [
      {
        id: 0n,
        name: "",
        state: "",
        column_values: [],
        board: {
          id: 0n,
          name: "",
          columns: [],
          groups: [],
        },
        group: {
          id: "",
          title: "",
          archived: true,
          position: 0,
        },
      },
    ];

    const item: ItemType = {
      id: 0n,
      name: "",
      state: "",
      column_values: [],
      board: {
        id: 0n,
        name: "",
        columns: [],
        groups: [],
      },
      group: {
        id: "",
        title: "",
        archived: true,
        position: 0,
      },
    };

    beforeEach(() => {
      mockedGetItem.getItem.mockResolvedValue(item);
      mockedGetItemsInGroupContainingItem.getItemsInGroupContainingItem.mockResolvedValue(
        items
      );
      mockedArchiveGroup.archiveGroup.mockResolvedValue(archiveGroup);
    });

    it("works", () =>
      expect(
        connector(client, itemId, statusColumnId, status, boardId)
      ).resolves.toBe(true));
  });

  describe("when the status columns are different", () => {
    const itemId = 123n;
    const statusColumnId = "1234";
    const status = "complete";
    const boardId = 321n;

    const archiveGroup: GroupType = {
      id: "321",
      title: "Test",
      archived: false,
      position: 0,
    };

    const items: ItemType[] = [
      {
        id: 0n,
        name: "",
        state: "",
        column_values: [
          {
            id: statusColumnId,
            text: status,
            value: "",
            type: "status",
            title: "Status",
          },
        ],
        board: {
          id: 0n,
          name: "",
          columns: [],
          groups: [],
        },
        group: {
          id: "",
          title: "",
          archived: false,
          position: 0,
        },
      },
      {
        id: 0n,
        name: "",
        state: "",
        column_values: [
          {
            id: statusColumnId,
            text: `${status}-fake`,
            value: "",
            type: "status",
            title: "Status",
          },
        ],
        board: {
          id: 0n,
          name: "",
          columns: [],
          groups: [],
        },
        group: {
          id: "",
          title: "",
          archived: false,
          position: 0,
        },
      },
    ];
    const item: ItemType = {
      id: 0n,
      name: "",
      state: "",
      column_values: [],
      board: {
        id: 0n,
        name: "",
        columns: [],
        groups: [],
      },
      group: {
        id: "",
        title: "",
        archived: false,
        position: 0,
      },
    };

    beforeEach(() => {
      mockedGetItem.getItem.mockResolvedValue(item);
      mockedGetItemsInGroupContainingItem.getItemsInGroupContainingItem.mockResolvedValue(
        items
      );
      mockedArchiveGroup.archiveGroup.mockResolvedValue(archiveGroup);
    });

    it("works", () =>
      expect(
        connector(client, itemId, statusColumnId, status, boardId)
      ).resolves.toBe(true));
  });

  describe("when there are no items in the group", () => {
    const itemId = 123n;
    const statusColumnId = "1234";
    const status = "complete";
    const boardId = 321n;

    const archiveGroup: GroupType = {
      id: "321",
      title: "Test",
      archived: false,
      position: 0,
    };

    const items: ItemType[] = [];
    const item: ItemType = {
      id: 0n,
      name: "",
      state: "",
      column_values: [],
      board: {
        id: 0n,
        name: "",
        columns: [],
        groups: [],
      },
      group: {
        id: "",
        title: "",
        archived: false,
        position: 0,
      },
    };

    beforeEach(() => {
      mockedGetItem.getItem.mockResolvedValue(item);
      mockedGetItemsInGroupContainingItem.getItemsInGroupContainingItem.mockResolvedValue(
        items
      );
      mockedArchiveGroup.archiveGroup.mockResolvedValue(archiveGroup);
    });

    it("works", () =>
      expect(
        connector(client, itemId, statusColumnId, status, boardId)
      ).resolves.toBe(true));
  });
});
