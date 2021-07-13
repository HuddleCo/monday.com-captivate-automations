import initMondayClient from "monday-sdk-js";
import { sprintf } from "sprintf-js";
import GraphQLRuntimeError from "../errors/graphqlRuntimeError";
import GraphQLSyntaxError from "../errors/graphqlSyntaxError";
import type { ApiResponse } from "../types";

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
    }
  | {
      boardId: number;
      groupId: string;
      columnId: string;
      value: string;
    };

let queryCounter = 0;

const log = <T>(
  query: string,
  variables: QueryVariablesType,
  response: ApiResponse<T>
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

const handleRequest = <T>(response: ApiResponse<T>): T => {
  if ("error_message" in response && typeof response.error_message === "string")
    throw new GraphQLSyntaxError(response);

  if (
    "errors" in response &&
    response.errors?.length &&
    response.errors.every((error) => typeof error.message === "string")
  )
    throw new GraphQLRuntimeError(response);

  if ("data" in response && response.data) return response.data;

  throw new Error("Unknown object recieved from Monday.com API");
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
      .then((response: ApiResponse<T>) => {
        log<T>(query, variables, response);
        return handleRequest<T>(response);
      });
  }
}