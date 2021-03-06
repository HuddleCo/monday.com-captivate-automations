import * as Sentry from "@sentry/browser";

import type { Request, Response, RequestHandler } from "express";

import connector from "../connectors/createContentForEpisodeConnector";
import { unmarshal } from "../middlewares/authentication/unmarshal";
import MondayApi from "../mondayApi";

export const post: RequestHandler = (req: Request, res: Response) =>
  connector(
    new MondayApi(unmarshal(req).shortLivedToken),
    req.body.payload.inboundFieldValues.itemId,
    req.body.payload.inboundFieldValues.targetBoardId
  ).then(
    (message) => res.status(200).send({ message }),
    (err) => {
      console.error(err);
      Sentry.captureException(err);
      res.status(500).send({ message: err.message });
    }
  );
