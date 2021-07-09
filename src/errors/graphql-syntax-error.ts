import { SyntaxErrorType } from "../types";

export default class GraphQLSyntaxError extends Error {
  public constructor(response: SyntaxErrorType) {
    super(response.error_message || "A syntax error has occurred");
  }
}
