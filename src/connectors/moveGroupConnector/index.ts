import MondayApi from "../../mondayApi";

import { archiveGroup } from "../../mondayApi/queries/archiveGroup";
import NoItemsInGroupError from "./noItemsInGroupError";
import DifferentStatusError from "./differentStatusError";
import GroupAlreadyArchivedError from "./groupAlreadyArchivedError";
import criticalSection from "./criticalSection";
import getItems from "./getItems";
import copyItemsToBoard from "./copyItemsToBoard";

export default (
  client: MondayApi,
  itemId: bigint,
  statusColumnId: string,
  status: string,
  boardId: bigint
): Promise<true> =>
  criticalSection(() =>
    getItems(client, itemId, statusColumnId, status).then(({ item, items }) =>
      Promise.all([
        archiveGroup(client, item.board.id, item.group.id),
        copyItemsToBoard(client, item, items, boardId),
      ])
    )
  )
    .catch((err) => {
      if (err instanceof GroupAlreadyArchivedError) return;
      if (err instanceof NoItemsInGroupError) return;
      if (err instanceof DifferentStatusError) return;

      throw err;
    })
    .then(() => true);
