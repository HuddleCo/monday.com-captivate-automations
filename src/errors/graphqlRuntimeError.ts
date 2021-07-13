import { ApiResponse, RuntimeErrorType } from "../types";

export const isRuntimeError = <T>(response: ApiResponse<T>): boolean =>
  "errors" in response &&
  !!response.errors?.length &&
  response.errors.every((error) => typeof error.message === "string");

export default class GraphQLRuntimeError extends Error {
  public constructor(response: RuntimeErrorType) {
    super(response.errors.map(({ message }) => message).join(". "));
  }
}
