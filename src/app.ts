import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
const { version } = require('../package.json');

dotenv.config();

const app = express();
const port = process.env.PORT || 80;

app.use(routes);

app.listen(port, () => {
  console.log(`Running version: ${version}`);
  console.log(`App listening at http://localhost:${port}`);
});

export default app;
