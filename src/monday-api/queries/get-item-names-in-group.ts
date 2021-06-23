import MondayClient from "..";

type GetItemNamesInGroupType = {
  boards: Array<{
    groups: Array<{
      items: Array<{
        name: string;
      }>;
    }>;
  }>;
};

export const getItemNamesInGroup = async (
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
