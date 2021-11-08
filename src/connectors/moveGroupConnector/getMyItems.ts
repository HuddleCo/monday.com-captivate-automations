import MondayApi from "../../mondayApi";
import { columnIsSameForAllItems } from "../../services/columnIsSameForAllItems";
import { getItemsInGroupContainingItem } from "../../mondayApi/queries/getItemsInGroupContainingItem";
import { ItemType } from "../../types";
import NoItemsInGroupError from "./noItemsInGroupError";
import DifferentStatusError from "./differentStatusError";

export default (
  client: MondayApi,
  item: ItemType,
  statusColumnId: string,
  status: string
) =>
  getItemsInGroupContainingItem(client, item).then((items) => {
    if (!items.length) throw new NoItemsInGroupError();

    if (!columnIsSameForAllItems(items, statusColumnId, status)) {
      throw new DifferentStatusError(status);
    }
    return items;
  });
