import initMondayClient from "monday-sdk-js";
import { OptionsType, Response } from "../types";

let queryCounter = 0;

export const performQuery = async <T>(
  token: string,
  query: string,
  variables: OptionsType
): Promise<T> => {
  const client = initMondayClient();
  client.setToken(token);

  const response: Response = await client.api(query, {
    variables,
  });

  console.log("-------------");
  console.log(`Query ${(queryCounter += 1)}:`);
  console.log(query);
  console.log("Variables:");
  console.log(variables);
  console.dir(response, { depth: null });
  console.log("-------------");

  if (response.errors) throw new Error(response.errors);

  const data = response.data as T;

  return data;
};
