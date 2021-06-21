import type { Request, Response, RequestHandler } from "express";

import connector from "../connectors/create-content-for-episode-connector";
import { unmarshal } from "../middlewares/authentication";
import MondayApi from "../monday-api";

export const post: RequestHandler = (req: Request, res: Response) =>
  connector(
    new MondayApi(unmarshal(req).shortLivedToken),
    req.body.payload.inboundFieldValues.itemId,
    req.body.payload.inboundFieldValues.targetBoardId
  ).then(
    (message) => res.status(200).send({ message }),
    (err) => res.status(500).send({ message: err.message })
  );
