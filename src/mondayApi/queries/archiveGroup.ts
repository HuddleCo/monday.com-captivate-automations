import type { GroupType } from "../../types";

import MondayApi from "..";
import { GROUP_SUBQUERY } from "./getBoard";

type ArchiveGroupType = {
  archive_group: GroupType;
};

export const archiveGroup = async (
  client: MondayApi,
  boardId: string,
  groupId: string
): Promise<GroupType> =>
  (
    await client.api<ArchiveGroupType>(
      `mutation archiveGroup($boardId: String!, $groupId: String!) {
        archive_group (board_id: $boardId, group_id: $groupId) {
          ${GROUP_SUBQUERY}
        }
      }`,
      {
        boardId,
        groupId,
      }
    )
  ).archive_group;
