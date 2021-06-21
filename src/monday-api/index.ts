import initMondayClient from "monday-sdk-js";
import { sprintf } from "sprintf-js";

type OptionsType = {
  boardId?: number;
  groupId?: string;
  itemName?: string;
  columnValues?: string;
  groupName?: string;
  groupTitle?: string;
  itemId?: number;
};

let queryCounter = 0;

export default class MondayApi {
  private client;

  constructor(token: string) {
    this.client = initMondayClient();
    this.client.setToken(token);
  }

  public async api<T>(query: string, variables: OptionsType): Promise<T> {
    const response = await this.client.api(query, { variables });

    console.log(sprintf("~~~~ %03d: Start~~~~", (queryCounter += 1)));
    console.log("Query:");
    console.log(query);
    console.log("Variables:");
    console.dir(variables, { depth: null });
    console.log("Response:");
    console.dir(response, { depth: null });
    console.log(sprintf("~~~~ %03d: End~~~~", queryCounter));

    if (response.errors) throw new Error(response.errors);

    return response.data as T;
  }
}
