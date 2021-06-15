import type { Request, Response, RequestHandler } from "express";

import connection from "../services/editor-to-uploader-service";
import { unmarshal } from "../middlewares/authentication";

export const executeAction: RequestHandler = (req: Request, res: Response) => {
  const { shortLivedToken } = unmarshal(req);
  const {
    boardId,
    columnValue: {
      label: { text },
    },
    itemId,
  } = req.body.payload.inboundFieldValues;

  console.dir(req.body.payload.inboundFieldValues, { depth: null });

  if (!shortLivedToken)
    return res.status(500).send({ message: "shortLivedToken is not provided" });

  connection(shortLivedToken, boardId, text, itemId).then(
    (message) => res.status(200).send({ message }),
    (err) => {
      console.error(err);
      return res.status(500).send({ message: "internal server error" });
    }
  );
};
