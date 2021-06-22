import type { Request, Response, RequestHandler } from "express";

import connector from "../connectors/move-item-connector";
import { unmarshal } from "../middlewares/authentication";
import MondayApi from "../monday-api";

export const post: RequestHandler = (req: Request, res: Response) =>
  connector(
    new MondayApi(unmarshal(req).shortLivedToken),
    req.body.payload.inboundFieldValues.boardId,
    req.body.payload.inboundFieldValues.itemId
  ).then(
    (message) => res.status(200).send({ message }),
    (err) => {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  );
