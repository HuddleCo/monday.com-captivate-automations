import initMondayClient from "monday-sdk-js";

type OptionsType = {
  boardId?: number;
  groupId?: string;
  itemName?: string;
  columnValues?: string;
  groupName?: string;
  itemId?: number;
};

export default class MondayApi {
  private client;

  private queryCounter = 0;

  constructor(token: string) {
    this.client = initMondayClient();
    this.client.setToken(token);
  }

  public async api<T>(query: string, variables: OptionsType): Promise<T> {
    const response = await this.client.api(query, { variables });

    if (process.env.ENVIRONMENT === "development") {
      console.log("-------------");
      console.log(`Query ${(this.queryCounter += 1)}:`);
      console.log(query);
      console.log("Variables:");
      console.log(variables);
      console.dir(response, { depth: null });
      console.log("-------------");
    }

    if (response.errors) throw new Error(response.errors);

    return response.data as T;
  }
}
