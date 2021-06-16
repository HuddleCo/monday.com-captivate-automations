import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import NoCredentialsError from "../errors/no-credentials-error";
import MissingMondaySigningSecretError from "../errors/missing-monday-signing-secret-error";
import MissingShortLivedTokenError from "../errors/missing-short-lived-token-error";

type OpenId = {
  // accountId: string; /* Unused property */
  // userId: string; /* Unused property */
  // backToUrl: string | undefined; /* Unused property */
  shortLivedToken: string | undefined;
};

export const unmarshal = (request: Request): OpenId => {
  const { authorization } = request.headers;
  if (typeof authorization !== "string") {
    throw new NoCredentialsError();
  }

  if (typeof process.env.MONDAY_SIGNING_SECRET !== "string") {
    throw new MissingMondaySigningSecretError();
  }

  const maybeSession = jwt.verify(
    authorization,
    process.env.MONDAY_SIGNING_SECRET
  );

  if (typeof maybeSession === "string")
    throw new Error("session can not be a string");

  const session = maybeSession as Record<string, unknown>;

  if (!session.shortLivedToken) throw new MissingShortLivedTokenError();

  return session as OpenId;
};

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> =>
  Promise.resolve(req)
    .then(unmarshal)
    .then(next)
    .catch((err) => {
      if (err instanceof NoCredentialsError) {
        res
          .status(401)
          .json({ error: "not authenticated, no credentials in request" });
      } else if (err instanceof MissingMondaySigningSecretError) {
        res.status(500).json({
          error: "Missing MONDAY_SIGNING_SECRET (should be in .env file)",
        });
      } else if (err instanceof MissingShortLivedTokenError) {
        res.status(500).json({ message: "shortLivedToken is not provided" });
      } else {
        res.status(401).json({
          error: "authentication error, could not verify credentials",
        });
      }
    });
