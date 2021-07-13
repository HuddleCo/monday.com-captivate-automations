import MondayApi from "..";

export const archiveItem = async (
  client: MondayApi,
  itemId: number
): Promise<void> => {
  await client.api(
    `mutation archiveItem($itemId: Int!) {
        archive_item (item_id: $itemId) {
          id
        }
      }`,
    {
      itemId,
    }
  );
};
