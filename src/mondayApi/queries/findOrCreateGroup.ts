import type { BoardType, GroupType } from "../../types";

import MondayApi from "..";
import { createGroup } from "./createGroup";

export const findOrCreateGroup = async (
  client: MondayApi,
  board: BoardType,
  groupTitle: string
): Promise<GroupType> =>
  board.groups.find(({ title }) => title === groupTitle) ||
  (await createGroup(client, board.id, groupTitle));
