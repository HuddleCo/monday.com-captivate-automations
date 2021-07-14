import * as Sentry from "@sentry/browser";

import type { Request, Response, RequestHandler } from "express";

import connector from "../connectors/podcastConnector";
import { unmarshal } from "../middlewares/authentication";
import MondayApi from "../mondayApi";

export const post: RequestHandler = (req: Request, res: Response) =>
  connector(
    new MondayApi(unmarshal(req).shortLivedToken),
    req.body.payload.inboundFieldValues.boardId,
    req.body.payload.inboundFieldValues.itemId
  ).then(
    (message) => res.status(200).send({ message }),
    (err) => {
      console.error(err);
      Sentry.captureException(err);
      res.status(500).send({ message: err.message });
    }
  );
