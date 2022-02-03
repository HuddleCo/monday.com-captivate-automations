import { BoardColumnsType, BoardType } from "../types";

let id = 0;

export const createBoard = (columns: Array<BoardColumnsType>): BoardType => {
  id += 1;
  return {
    id: String(id),
    name: "Board Name",
    columns,
    groups: [],
  };
};
