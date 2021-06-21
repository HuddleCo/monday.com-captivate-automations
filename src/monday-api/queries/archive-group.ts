import type { GroupType } from "../../types";
import MondayClient from "..";

type ArchiveGroupType = {
  archive_group: GroupType;
};

export const archiveGroup = async (
  client: MondayClient,
  boardId: number,
  groupId: string
): Promise<GroupType> =>
  (
    await client.api<ArchiveGroupType>(
      `mutation archiveGroup($boardId: Int!, $groupId: String!) {
        archive_group (board_id: $boardId, group_id: $groupId) {
          id
        }
      }`,
      {
        boardId,
        groupId,
      }
    )
  ).archive_group;
