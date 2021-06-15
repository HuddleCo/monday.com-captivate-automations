import { Router } from "express";

import * as transformationController from "../controllers/tuesday-controller";
import { authenticationMiddleware } from "../middlewares/authentication";

const router = Router();

router.post(
  "/tuesday/execute_action",
  authenticationMiddleware,
  transformationController.executeAction
);

export default router;
