import { Mutex, withTimeout } from "async-mutex";

import type { BoardType, GroupType } from "../types";

import MondayClient from "../monday-api";
import { getBoard } from "../monday-api/queries/get-board";
import { findOrCreateGroup } from "../monday-api/queries/find-or-create-group";

import MutexTimeoutError from "../errors/mutex-timeout-error";

type BoardGroupType = { board: BoardType; group: GroupType };

const CRITICAL_SECTION_TIMEOUT_MS = 10_000;
const mutex = withTimeout(
  new Mutex(),
  CRITICAL_SECTION_TIMEOUT_MS,
  new MutexTimeoutError()
);

export const findOrCreateGroupInBoard = (
  client: MondayClient,
  boardId: number,
  groupTitle: string
): Promise<BoardGroupType> =>
  mutex.runExclusive(async () => {
    const board = await getBoard(client, boardId);
    const group = await findOrCreateGroup(client, board, groupTitle);

    return { board, group };
  });