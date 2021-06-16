import { allItemsComplete as allItemsMatch } from "../services/allItemsComplete";
import { createItem } from "../services/createItem";
import { getItem } from "../services/getItem";
import { getItemsInGroupContainingItem } from "../services/getItemsInGroupContainingItem";

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

  await createItem(token, boardId, "", "Sample", item);

  return `All episodes are ${status}. Autobots roll-out!`;
};
