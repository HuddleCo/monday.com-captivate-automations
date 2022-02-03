import MondayApi from "../../mondayApi";
import { createItemsInGroupOnBoard } from "../../services/createItemsInGroupOnBoard";
import { findOrCreateGroupInBoard } from "../../services/findOrCreateGroupInBoard";
import { ItemType } from "../../types";

export default (
  client: MondayApi,
  item: ItemType,
  items: ItemType[],
  boardId: string
) =>
  findOrCreateGroupInBoard(client, boardId, item.group.title).then(
    ({ board, group }) => createItemsInGroupOnBoard(client, board, group, items)
  );
