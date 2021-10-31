import express from "express";
import dotenv from "dotenv";
import morganBody from "morgan-body";
import * as Sentry from "@sentry/node";

import routes from "./routes";

import * as pack from "../package.json";

dotenv.config();

const app = express();
const port = process.env.PORT || 80;

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  release: `${pack.name}@${pack.version}`,
  environment: process.env.NODE_ENV,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

morganBody(app, { noColors: true });
app.use(express.json());
app.use(routes);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
  console.log(`Version:\t${pack.version}`);
  console.log(`Environment:\t${process.env.NODE_ENV}`);
  console.log(`Listening:\thttp://localhost:${port}`);
});

export default app;
