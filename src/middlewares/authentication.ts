import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import NoCredentialsError from "../errors/no-credentials-error";
import MissingMondaySigningSecretError from "../errors/missing-monday-signing-secret-error";
import MissingShortLivedTokenError from "../errors/missing-short-lived-token-error";

type OpenId = {
  // accountId: string /* Unused property */;
  // userId: string /* Unused property */;
  // backToUrl: string | undefined; /* Unused property */
  shortLivedToken: string;
};

const isOpenId = (maybeOpenId: Partial<OpenId>): maybeOpenId is OpenId => {
  const openId = maybeOpenId as OpenId;
  return typeof openId.shortLivedToken === "string";
};

export const unmarshal = (request: Request): OpenId => {
  const { authorization } = request.headers;
  if (typeof authorization !== "string") {
    throw new NoCredentialsError();
  }

  if (typeof process.env.MONDAY_SIGNING_SECRET !== "string") {
    throw new MissingMondaySigningSecretError();
  }

  const payload = jwt.verify(
    authorization,
    process.env.MONDAY_SIGNING_SECRET
  ) as Partial<OpenId>;

  if (!isOpenId(payload)) throw new MissingShortLivedTokenError();

  return payload;
};

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> =>
  Promise.resolve(req)
    .then(unmarshal)
    .then(() => next())
    .catch((err) => {
      if (err instanceof NoCredentialsError) {
        res
          .status(401)
          .send({ error: "not authenticated, no credentials in request" });
      } else if (err instanceof MissingMondaySigningSecretError) {
        res.status(500).send({
          error: "Missing MONDAY_SIGNING_SECRET (should be in .env file)",
        });
      } else if (err instanceof MissingShortLivedTokenError) {
        res.status(500).send({ message: "shortLivedToken is not provided" });
      } else {
        res.status(401).send({
          error: "authentication error, could not verify credentials",
        });
      }
    });
