import { allItemsComplete as allItemsMatch } from "./allItemsComplete";
import { getItem } from "./getItem";
import { getItemsInGroupContainingItem } from "./getItemsInGroupContainingItem";

export default async (
  token: string,
  itemId: number,
  statusColumnId: string,
  status: string,
  boardId: number
): Promise<string> => {
  const item = await getItem(token, itemId);
  const items = await getItemsInGroupContainingItem(token, item);

  if (!allItemsMatch(items, statusColumnId, status))
    return `Some episodes are not ${status}. No go buddy`;

  return `All episodes are ${status}. Autobots roll-out!`;
};
