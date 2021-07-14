import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import NoCredentialsError from "../errors/noCredentialsError";
import MissingMondaySigningSecretError from "../errors/missingMondaySigningSecretError";
import MissingShortLivedTokenError from "../errors/missingShortLivedTokenError";

type OpenId = {
  shortLivedToken: string;
};

const isOpenId = (maybeOpenId: Partial<OpenId>): maybeOpenId is OpenId => {
  const openId = maybeOpenId as OpenId;
  return typeof openId.shortLivedToken === "string";
};

export const unmarshal = (request: Request): OpenId => {
  if (process.env.TOKEN_OVERRIDE)
    return { shortLivedToken: process.env.TOKEN_OVERRIDE };

  const { authorization } = request.headers;
  if (typeof authorization !== "string") throw new NoCredentialsError();

  if (typeof process.env.MONDAY_SIGNING_SECRET !== "string")
    throw new MissingMondaySigningSecretError();

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
    .catch((err) => {
      if (err instanceof NoCredentialsError) {
        res
          .status(401)
          .send({ error: "not authenticated, no credentials in request" });
      } else if (err instanceof MissingMondaySigningSecretError) {
        res.status(500).send({
          error: "Missing MONDAY_SIGNING_SECRET",
        });
      } else if (err instanceof MissingShortLivedTokenError) {
        res.status(500).send({ error: "shortLivedToken is not provided" });
      } else {
        res.status(401).send({
          error: "authentication error, could not verify credentials",
        });
      }
    })
    .then(() => next());
