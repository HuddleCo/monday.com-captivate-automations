import * as Sentry from "@sentry/browser";

import type { Request, Response, RequestHandler } from "express";

import connector from "../connectors/moveGroupConnector";
import { unmarshal } from "../middlewares/authentication/unmarshal";
import GraphQLRuntimeError from "../errors/graphqlRuntimeError";
import MutexTimeoutError from "../errors/mutexTimeoutError";
import MondayApi from "../mondayApi";

const errorCodeFor = (error: Error): number => {
  if (error instanceof GraphQLRuntimeError) return 502;
  if (error instanceof MutexTimeoutError) return 504;

  return 500;
};

const wrapper = (res: Response, promise: Promise<true>) =>
  promise.then(
    () => res.status(200).send({ message: "OK" }),
    (err) => {
      console.error(err);
      Sentry.captureException(err);
      return res.status(errorCodeFor(err)).send({ message: err.message });
    }
  );

export const post: RequestHandler = (req: Request, res: Response) => {
  if (!req?.body?.payload?.inboundFieldValues?.itemId) {
    res.status(422).send({
      message: "Missing parameter: payload.inboundFieldValues.itemId",
    });
  }
  if (!req?.body?.payload?.inboundFieldValues?.statusColumnId) {
    res.status(422).send({
      message: "Missing parameter: payload.inboundFieldValues.statusColumnId",
    });
  }
  if (!req?.body?.payload?.inboundFieldValues?.statusColumnValue?.label?.text) {
    res.status(422).send({
      message:
        "Missing parameter: payload.inboundFieldValues.statusColumnValue.label.text",
    });
  }
  if (!req?.body?.payload?.inboundFieldValues?.boardId) {
    res.status(422).send({
      message: "Missing parameter: payload.inboundFieldValues.boardId",
    });
  }

  return wrapper(
    res,
    connector(
      new MondayApi(unmarshal(req).shortLivedToken),
      req.body.payload.inboundFieldValues.itemId,
      req.body.payload.inboundFieldValues.statusColumnId,
      req.body.payload.inboundFieldValues.statusColumnValue.label.text,
      req.body.payload.inboundFieldValues.boardId
    )
  );
};
