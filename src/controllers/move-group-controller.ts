import * as Sentry from "@sentry/browser";

import type { Request, Response, RequestHandler } from "express";

import connector from "../connectors/move-content-connector";
import { unmarshal } from "../middlewares/authentication";
import MondayApi from "../monday-api";

export const post: RequestHandler = (req: Request, res: Response) =>
  connector(
    new MondayApi(unmarshal(req).shortLivedToken),
    req.body.payload.inboundFieldValues.itemId,
    req.body.payload.inboundFieldValues.statusColumnId,
    req.body.payload.inboundFieldValues.statusColumnValue.label.text,
    req.body.payload.inboundFieldValues.boardId
  ).then(
    (message) => res.status(200).send({ message }),
    (err) => {
      console.error(err);
      Sentry.captureException(err);
      res.status(500).send({ message: err.message });
    }
  );
