import MondayClient from "..";
import { BoardType, GroupType, ItemType } from "../../types";

type GetItemNamesInGroupType = {
  boards: Array<{
    groups: Array<{
      items: Array<{
        name: string;
      }>;
    }>;
  }>;
};

const getItemNamesInGroup = async (
  client: MondayClient,
  boardId: number,
  groupId: string
): Promise<Array<{ name: string }>> =>
  (
    await client.api<GetItemNamesInGroupType>(
      `query getItemNamesInGroup($boardId: Int, $groupId: String) {
        boards (ids: [$boardId]) {
          groups (ids: [$groupId]) {
            items {
              name
            }
          }
        }
      }`,
      {
        boardId,
        groupId,
      }
    )
  ).boards[0]?.groups[0]?.items || [];

export const isDuplicateItem = (
  client: MondayClient,
  board: BoardType,
  group: GroupType,
  item: ItemType
): Promise<boolean> =>
  getItemNamesInGroup(client, board.id, group.id).then(
    (items) => !!items.find(({ name }) => name === item.name)
  );
