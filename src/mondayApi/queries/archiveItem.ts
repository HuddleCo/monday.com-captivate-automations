import MondayApi from "..";

type ArchiveItemType = {
  archive_item: {
    id: number;
  };
};

export const archiveItem = (
  client: MondayApi,
  itemId: number
): Promise<{ id: number }> =>
  client
    .api<ArchiveItemType>(
      `mutation archiveItem($itemId: Int!) {
        archive_item (item_id: $itemId) {
          id
        }
      }`,
      {
        itemId,
      }
    )
    .then(({ archive_item: { id } }) => ({ id }));
