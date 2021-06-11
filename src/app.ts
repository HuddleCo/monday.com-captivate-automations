import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 80;

app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Version:\t${process.env.npm_package_version}`);
  console.log(`Listening:\thttp://localhost:${port}`);
});

export default app;
