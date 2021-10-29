import jwt from "jsonwebtoken";
import { OpenId } from "./openIdType";
import MissingMondaySigningSecretError from "./missingMondaySigningSecretError";
import InvalidCredentialsError from "./invalidCredentialsError";

export const getPayload = (authorization: string): Partial<OpenId> => {
  if (typeof process.env.MONDAY_SIGNING_SECRET !== "string") {
    throw new MissingMondaySigningSecretError();
  }

  try {
    return jwt.verify(
      authorization,
      process.env.MONDAY_SIGNING_SECRET
    ) as Partial<OpenId>;
  } catch (err) {
    throw new InvalidCredentialsError();
  }
};
