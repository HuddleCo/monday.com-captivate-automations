import { Router } from "express";
import * as mondayController from "../controllers/monday-controller";
import { authenticationMiddleware } from "../middlewares/authentication";
import tuesday from "./tuesday";
import wednesday from "./wednesday";

const router = Router();

router.use("/monday", authenticationMiddleware);
// This route is depricated. Remove in version 2.0.0
router.post(
  "/monday/execute_action",
  authenticationMiddleware,
  mondayController.post
);

router.use("/monday/copywriter", wednesday);
router.use("/monday/editor", tuesday);

export default router;
