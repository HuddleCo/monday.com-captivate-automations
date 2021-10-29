import { Request } from "express";

import { OpenId } from "./openIdType";
import { isOpenId } from "./isOpenId";

import NoCredentialsError from "./noCredentialsError";
import MissingShortLivedTokenError from "./missingShortLivedTokenError";
import { getPayload } from "./getPayload";

export const unmarshal = (request: Request): OpenId => {
  if (process.env.TOKEN_OVERRIDE) {
    return { shortLivedToken: process.env.TOKEN_OVERRIDE };
  }

  const { authorization } = request.headers;
  if (typeof authorization !== "string") throw new NoCredentialsError();

  const payload = getPayload(authorization);

  if (!isOpenId(payload)) throw new MissingShortLivedTokenError();

  return payload;
};
