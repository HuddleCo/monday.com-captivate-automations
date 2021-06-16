import { ItemType, GroupType, CreateGroupType } from "../types";
import { clientNameFor } from "./clientNameFor";
import { executeQuery } from "./execute-query";

export const createGroup = async (
  token: string,
  boardId: number,
  episode: ItemType
): Promise<GroupType> => {
  const data = await executeQuery<CreateGroupType>(
    token,
    `mutation($boardId: Int!, $groupName: String!) {
      create_group (board_id: $boardId, group_name: $groupName) {
        id
      }
    }`,
    {
      boardId,
      groupName: `${clientNameFor(episode)} - ${episode.name}`,
    }
  );

  return { id: data.create_group.id };
};
