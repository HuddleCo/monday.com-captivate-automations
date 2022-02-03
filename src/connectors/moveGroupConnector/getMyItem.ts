import MondayApi from "../../mondayApi";
import { getItem } from "../../mondayApi/queries/getItem";
import GroupAlreadyArchivedError from "./groupAlreadyArchivedError";

export default (client: MondayApi, itemId: bigint) =>
  getItem(client, itemId).then((item) => {
    if (item.group.archived) throw new GroupAlreadyArchivedError();

    return item;
  });
