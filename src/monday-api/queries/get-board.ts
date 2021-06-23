import { BoardType } from "../../types";
import MondayClient from "..";

type GetBoardType = {
  boards: Array<BoardType>;
};

export const GROUP_SUBQUERY = `
  id
  title
  archived
  position
`;

export const BOARD_SUBQUERY = `
  id
  name
  columns {
    id
    title
    type
    settings_str
  }
  groups {
    ${GROUP_SUBQUERY}
  }
  `;

export const getBoard = async (
  client: MondayClient,
  boardId: number
): Promise<BoardType> => {
  const data = await client.api<GetBoardType>(
    `query getBoard($boardId: [Int]) {
      boards(ids: $boardId) {
        ${BOARD_SUBQUERY}
      }
    }`,
    {
      boardId,
    }
  );

  const board = data.boards[0];
  board.columns = board.columns.map((column) => ({
    ...column,
    settings: JSON.parse(column.settings_str),
  }));
  board.id = Number(board.id);
  board.groups = board.groups.map((group) => ({ ...group, position: Number(group.position) }));

  return board;
};
