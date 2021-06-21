import { ItemType, GroupType } from "../../types";
import { clientNameForEpisode } from "../../services/client-name-for-episode";
import MondayClient from "..";

type GetGroupType = {
  boards: Array<{
    groups: Array<Foo>;
  }>;
};

type Foo = {
  id: string;
  title: string;
  position: string;
};

type DuplicateGroupType = {
  duplicate_group: GroupType;
};

export const createGroupAtBottom = async (
  client: MondayClient,
  boardId: number,
  episode: ItemType
): Promise<GroupType> => {
  const group: Foo = (
    await client.api<GetGroupType>(
      `query getGroup($boardId: Int!) {
        boards(ids: [$boardId]) {
          groups {
            id
            title
            position
          }
        }
      }`,
      {
        boardId,
      }
    )
  ).boards[0].groups.sort(({ position }) => -Number(position))[0];

  const newGroup: Bar = (
    await client.api<DuplicateGroupType>(
      `mutation duplicateGroup($boardId: Int!, $groupId: String!, $groupTitle: String!) {
        duplicate_group(board_id: $boardId, group_id: $groupId, group_title: $groupTitle, add_to_top: false) {
          id
          items {
            id
          }
        }
      }`,
      {
        boardId,
        groupTitle: `${clientNameForEpisode(episode)} - ${episode.name}`,
        groupId: group.id,
      }
    )
  ).duplicate_group;
};
