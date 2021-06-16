import { allItemsMatch } from "../services/all-items-match";
import { getItem } from "../monday-api/queries/get-item";
import { getItemsInGroupContainingItem } from "../monday-api/queries/get-items-in-group-containing-item";
import MondayClient from "../monday-api";
import { createItem } from "../monday-api/queries/create-item";
import { episodeName } from "../services/episode-name";
import { getBoard } from "../monday-api/queries/get-board";
import { smash } from "../services/smash";

export default async (
  client: MondayClient,
  itemId: number,
  statusColumnId: string,
  status: string,
  boardId: number
): Promise<string> => {
  const content = await getItem(client, itemId);
  const contents = await getItemsInGroupContainingItem(client, content);
  const board = await getBoard(client, boardId);

  if (!allItemsMatch(contents, statusColumnId, status))
    return `Some contents are not ${status}. Abort`;

  await createItem(
    client,
    boardId,
    "",
    episodeName(content),
    JSON.stringify(smash(contents, board))
  );

  return `All contents are ${status}. Autobots roll-out!`;
};
