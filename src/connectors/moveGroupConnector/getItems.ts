import MondayApi from "../../mondayApi";
import getMyItem from "./getMyItem";
import getMyItems from "./getMyItems";

export default (
  client: MondayApi,
  itemId: number,
  statusColumnId: string,
  status: string
) =>
  getMyItem(client, itemId).then((item) =>
    getMyItems(client, item, statusColumnId, status).then((items) => ({
      item,
      items,
    }))
  );
