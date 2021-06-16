import { allItemsMatch } from "../services/all-items-match";
import { getItem } from "../monday-api/queries/get-item";
import { getItemsInGroupContainingItem } from "../monday-api/queries/get-items-in-group-containing-item";
import MondayClient from "../monday-api";
import { createItem } from "../monday-api/queries/create-item";

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
