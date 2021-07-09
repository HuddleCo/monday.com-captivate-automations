import initMondayClient from "monday-sdk-js";
import { sprintf } from "sprintf-js";

type QueryVariablesType =
  | { itemId: number }
  | { boardId: number }
  | { boardId: number; groupId: string }
  | { boardId: number; groupName: string }
  | {
      boardId: number;
      groupId: string;
      itemName: string;
      columnValues: string;
    };

type Response<T> = {
  data: T;
  error_message?: string;
  errors?: Array<{
    message: string;
  }>;
};

let queryCounter = 0;

const log = <T>(
  query: string,
  variables: QueryVariablesType,
  response: Response<T>
) => {
  console.log(sprintf("~~~~ %03d: Start~~~~", (queryCounter += 1)));
  console.log("Query:");
  console.log(query);
  console.log("Variables:");
  console.dir(variables, { depth: null });
  console.log("Response:");
  console.dir(response, { depth: null });
  console.log(sprintf("~~~~ %03d: End~~~~", queryCounter));
};

export default class MondayApi {
  private client;

  constructor(token: string) {
    this.client = initMondayClient();
    this.client.setToken(token);
  }

  public async api<T>(
    query: string,
    variables: QueryVariablesType
  ): Promise<T> {
    return this.client
      .api(query, { variables })
      .then((response: Response<T>) => {
        log<T>(query, variables, response);

        if (response.errors)
          throw new Error(
            response.errors.map(({ message }) => message).join(". ")
          );

        if (response.error_message)
          throw new Error(response.error_message || "An error has occoured");

        return response.data;
      });
  }
}
