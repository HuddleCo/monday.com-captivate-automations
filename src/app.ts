import express from "express";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";

import routes from "./routes";

import * as pack from "../package.json";

dotenv.config();

const app = express();
const port = process.env.PORT || 80;

Sentry.init({
  dsn: "https://3ebd3ce246be4618bb1fd0e0d29dd52c@o849248.ingest.sentry.io/5816131",
  release: `${pack.name}@${pack.version}`,
  // Deprication notice: Remove ENVIRONMENT in v3.0.0
  environment: process.env.NODE_ENV || process.env.ENVIRONMENT,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.use(express.json());
app.use(routes);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
  console.log(`Version:\t${pack.version}`);
  console.log(
    // Deprication notice: Remove ENVIRONMENT in v3.0.0
    `Environment:\t${process.env.NODE_ENV || process.env.ENVIRONMENT}`
  );
  console.log(`Listening:\thttp://localhost:${port}`);
});

export default app;
