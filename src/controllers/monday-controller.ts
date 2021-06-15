import type { Request, Response, RequestHandler } from "express";

import connection from "../services/monday-service";
import { unmarshal } from "../middlewares/authentication";

export const executeAction: RequestHandler = (req: Request, res: Response) => {
  const { shortLivedToken } = unmarshal(req);
  const { itemId, targetBoardId } = req.body.payload.inboundFieldValues;

  return !shortLivedToken
    ? res.status(500).send({ message: "shortLivedToken is not provided" })
    : connection(shortLivedToken, itemId, targetBoardId).then(
        (message) => res.status(200).send({ message }),
        (err) => {
          console.error(err);
          return res.status(500).send({ message: "internal server error" });
        }
      );
};
