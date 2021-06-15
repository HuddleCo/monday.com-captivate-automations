import type { Request, Response, RequestHandler } from "express";

import connection from "../services/editor-to-uploader-service";
import { unmarshal } from "../middlewares/authentication";

export const executeAction: RequestHandler = (req: Request, res: Response) => {
  const { shortLivedToken } = unmarshal(req);
  const {
    itemId,
    statusColumnValue: {
      label: { text },
    },
    statusColumnId,
    boardId,
  } = req.body.payload.inboundFieldValues;

  console.dir(req.body.payload.inboundFieldValues, { depth: null });

  if (!shortLivedToken)
    return res.status(500).send({ message: "shortLivedToken is not provided" });

  return connection(
    shortLivedToken,
    itemId,
    statusColumnId,
    text,
    boardId
  ).then(
    (message) => {
      console.log(message);
      return res.status(200).send({ message });
    },
    (err) => {
      console.error(err);
      return res.status(500).send({ message: "internal server error" });
    }
  );
};
