import type { Request, Response, RequestHandler } from "express";

import connection from "../services/monday-service";
import { unmarshal } from "../middlewares/authentication";

export const executeAction: RequestHandler = (req: Request, res: Response) =>
  connection(
    unmarshal(req).shortLivedToken,
    req.body.payload.inboundFieldValues.itemId,
    req.body.payload.inboundFieldValues.targetBoardId
  ).then(
    (message) => res.status(200).send({ message }),
    (err) => res.status(500).send({ message: err.message })
  );
