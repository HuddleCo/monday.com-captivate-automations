import MondayApi from "..";

type ArchiveItemType = {
  archive_item: {
    id: bigint;
  };
};

export const archiveItem = (
  client: MondayApi,
  itemId: bigint
): Promise<{ id: bigint }> =>
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
