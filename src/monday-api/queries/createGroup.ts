import { ItemType, GroupType } from "../../types";
import { clientNameFor } from "../../services/clientNameFor";
import MondayClient from "..";

type CreateGroupType = {
  create_group: GroupType;
};

export const createGroup = async (
  client: MondayClient,
  boardId: number,
  episode: ItemType
): Promise<GroupType> =>
  (
    await client.api<CreateGroupType>(
      `mutation($boardId: Int!, $groupName: String!) {
        create_group (board_id: $boardId, group_name: $groupName) {
          id
        }
      }`,
      {
        boardId,
        groupName: `${clientNameFor(episode)} - ${episode.name}`,
      }
    )
  ).create_group;
