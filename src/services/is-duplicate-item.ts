import MondayClient from "../monday-api";
import { getItemNamesInGroup } from "../monday-api/queries/get-item-names-in-group";
import { BoardType, GroupType, ItemType } from "../types";

export const isDuplicateItem = async (
  client: MondayClient,
  board: BoardType,
  topGroup: GroupType,
  item: ItemType
): Promise<boolean> => {
  const items = await getItemNamesInGroup(client, board.id, topGroup.id);
  return !!items.find(({ name }) => name === item.name);
};
