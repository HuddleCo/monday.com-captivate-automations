import { NextFunction, Request, Response } from "express";

import NoCredentialsError from "./noCredentialsError";
import MissingMondaySigningSecretError from "./missingMondaySigningSecretError";
import MissingShortLivedTokenError from "./missingShortLivedTokenError";
import InvalidCredentialsError from "./invalidCredentialsError";
import { unmarshal } from "./unmarshal";

const errorCodeFor = (error: Error): number => {
  if (error instanceof NoCredentialsError) return 401;
  if (error instanceof MissingMondaySigningSecretError) return 500;
  if (error instanceof MissingShortLivedTokenError) return 422;
  if (error instanceof InvalidCredentialsError) return 403;

  return 500;
};

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> =>
  Promise.resolve(req)
    .then(unmarshal)
    .catch((err) =>
      res.status(errorCodeFor(err)).send({ message: err.message })
    )
    .then(() => next());
