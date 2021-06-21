import { Router } from "express";

import { authenticationMiddleware } from "../middlewares/authentication";
import * as copywriterController from "../controllers/copywriter-controller";
import * as editorController from "../controllers/editor-controller";
import * as contentController from "../controllers/content-controller";

const router = Router();

router.use("/monday", authenticationMiddleware);

// This route is depricated. Remove in version 2.0.0
router.post(
  "/monday/execute_action",
  authenticationMiddleware,
  copywriterController.post
);

router.post("/monday/copywriter", copywriterController.post);
router.post("/monday/editor", editorController.post);
router.post("/monday/content", contentController.post);

export default router;
