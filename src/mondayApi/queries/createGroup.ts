import type { GroupType } from "../../types";
import MondayApi from "..";

type CreateGroupType = {
  create_group: GroupType;
};

export const createGroup = async (
  client: MondayApi,
  boardId: string,
  groupName: string
): Promise<GroupType> =>
  (
    await client.api<CreateGroupType>(
      `mutation createGroup($boardId: String!, $groupName: String!) {
        create_group (board_id: $boardId, group_name: $groupName) {
          id
        }
      }`,
      {
        boardId,
        groupName,
      }
    )
  ).create_group;
