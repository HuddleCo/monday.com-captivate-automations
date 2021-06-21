import type { BoardType, GroupType } from "../../types";

import MondayClient from "..";
import { createGroup } from "./create-group";

export const findOrCreateGroup = async (
  client: MondayClient,
  board: BoardType,
  groupTitle: string
): Promise<GroupType> =>
  board.groups.find(({ title }) => title === groupTitle) ||
  (await createGroup(client, board.id, groupTitle));
