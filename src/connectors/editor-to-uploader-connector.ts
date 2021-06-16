import { allItemsComplete as allItemsMatch } from "../services/allItemsComplete";
import { getItem } from "../monday-api/queries/getItem";
import { getItemsInGroupContainingItem } from "../monday-api/queries/getItemsInGroupContainingItem";
import MondayClient from "../monday-api";
import { createItem } from "../monday-api/queries/createItem";

export default async (
  client: MondayClient,
  itemId: number,
  statusColumnId: string,
  status: string,
  boardId: number
): Promise<string> => {
  const item = await getItem(client, itemId);
  const items = await getItemsInGroupContainingItem(client, item);

  if (!allItemsMatch(items, statusColumnId, status))
    return `Some episodes are not ${status}. No go buddy`;

  await createItem(client, boardId, "", "Sample", item);

  return `All episodes are ${status}. Autobots roll-out!`;
};
