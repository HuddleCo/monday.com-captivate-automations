import { Mutex, withTimeout } from "async-mutex";

import type { BoardType, GroupType } from "../types";

import MondayApi from "../mondayApi";
import { getBoard } from "../mondayApi/queries/getBoard";
import { findOrCreateGroup } from "../mondayApi/queries/findOrCreateGroup";

import MutexTimeoutError from "../errors/mutexTimeoutError";

type BoardGroupType = { board: BoardType; group: GroupType };

const CRITICAL_SECTION_TIMEOUT_MS = 10_000;
const mutex = withTimeout(
  new Mutex(),
  CRITICAL_SECTION_TIMEOUT_MS,
  new MutexTimeoutError(CRITICAL_SECTION_TIMEOUT_MS)
);

export const findOrCreateGroupInBoard = (
  client: MondayApi,
  boardId: bigint,
  groupTitle: string
): Promise<BoardGroupType> =>
  mutex.runExclusive(async () => {
    const board = await getBoard(client, boardId);
    const group = await findOrCreateGroup(client, board, groupTitle);

    return { board, group };
  });
