import { Mutex, withTimeout } from "async-mutex";

import type { GroupType } from "../types";

import MondayClient from "../monday-api";

import { archiveGroup } from "../monday-api/queries/archive-group";

import MutexTimeoutError from "../errors/mutex-timeout-error";

const CRITICAL_SECTION_TIMEOUT_MS = 4_000;
const mutex = withTimeout(
  new Mutex(),
  CRITICAL_SECTION_TIMEOUT_MS,
  new MutexTimeoutError()
);

export const archiveGroupMutex = async (
  client: MondayClient,
  boardId: number,
  groupId: string
): Promise<GroupType> =>
  mutex.runExclusive(() => archiveGroup(client, boardId, groupId));
