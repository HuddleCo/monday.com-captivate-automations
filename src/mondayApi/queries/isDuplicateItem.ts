import MondayApi from "..";

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
  client: MondayApi,
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
  client: MondayApi,
  boardId: number,
  groupId: string,
  itemName: string
): Promise<boolean> =>
  getItemNamesInGroup(client, boardId, groupId).then(
    (items) => !!items.find(({ name }) => name === itemName)
  );
