import { OnUnhandledRejection } from "@sentry/node/dist/integrations";
import { lookup } from "dns";
import initMondayClient from "monday-sdk-js";
import { sprintf } from "sprintf-js";

type OptionsType = {
  boardId?: number;
  groupId?: string;
  itemName?: string;
  columnValues?: string;
  groupName?: string;
  itemId?: number;
};

type Response<T> = {
  data: T;
  status_code?: number;
  error_message?: string;
  errors?: Array<{
    message: string;
  }>;
};

let queryCounter = 0;

export default class MondayApi {
  private client;

  constructor(token: string) {
    this.client = initMondayClient();
    this.client.setToken(token);
  }

  public async api<T>(query: string, variables: OptionsType): Promise<T> {
    const response: Response<T> = await this.client.api(query, { variables });

    console.log(sprintf("~~~~ %03d: Start~~~~", (queryCounter += 1)));
    console.log("Query:");
    console.log(query);
    console.log("Variables:");
    console.dir(variables, { depth: null });
    console.log("Response:");
    console.dir(response, { depth: null });
    console.log(sprintf("~~~~ %03d: End~~~~", queryCounter));

    if (response.errors)
      throw new Error(response.errors.map((error) => error.message).join(". "));

    if (response.status_code)
      throw new Error(response.error_message || "An error has occoured");

    return response.data;
  }
}
