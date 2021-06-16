import type { Request, Response, RequestHandler } from "express";

import connection from "../services/editor-to-uploader-service";
import { unmarshal } from "../middlewares/authentication";

export const executeAction: RequestHandler = (req: Request, res: Response) =>
  connection(
    unmarshal(req).shortLivedToken,
    req.body.payload.inboundFieldValues.itemId,
    req.body.payload.inboundFieldValues.statusColumnId,
    req.body.payload.inboundFieldValues.statusColumnValue.label.text,
    req.body.payload.inboundFieldValues.boardId
  ).then(
    (message) => res.status(200).send({ message }),
    (err) => res.status(500).send({ message: `Error: ${err.message}` })
  );
