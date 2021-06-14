import { Router } from "express";

import * as transformationController from "../controllers/monday-controller";
import { authenticationMiddleware } from "../middlewares/authentication";

const router = Router();

router.post(
  "/monday/execute_action",
  authenticationMiddleware,
  transformationController.executeAction
);

export default router;
