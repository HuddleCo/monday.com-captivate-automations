import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import NoCredentialsError from "../errors/no-credentials-error";
import MissingMondaySigningSecretError from "../errors/missing-monday-signing-secret-error";

type Session = {
  accountId: string;
  userId: string;
  backToUrl: string | undefined;
  shortLivedToken: string | undefined;
};

export const unmarshal = (request: Request): Session => {
  const { authorization } = request.headers;
  if (typeof authorization !== "string") throw new NoCredentialsError();

  if (typeof process.env.MONDAY_SIGNING_SECRET !== "string") {
    throw new MissingMondaySigningSecretError();
  }

  return jwt.verify(
    authorization,
    process.env.MONDAY_SIGNING_SECRET
  ) as Session;
};

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    unmarshal(req);

    next();
  } catch (err) {
    if (err instanceof NoCredentialsError) {
      res
        .status(401)
        .json({ error: "not authenticated, no credentials in request" });
    } else if (err instanceof MissingMondaySigningSecretError) {
      res.status(500).json({
        error: "Missing MONDAY_SIGNING_SECRET (should be in .env file)",
      });
    } else {
      res
        .status(401)
        .json({ error: "authentication error, could not verify credentials" });
    }
  }
};
