import { BoardColumnsType, BoardType } from "../types";

let id = 0n;

export const createBoard = (columns: Array<BoardColumnsType>): BoardType => {
  id += 1n;
  return {
    id,
    name: "Board Name",
    columns,
    groups: [],
  };
};
