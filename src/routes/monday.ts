import { Router } from "express";

import { authenticationMiddleware } from "../middlewares/authentication";
import * as copywriterController from "../controllers/copywriter-controller";
import * as moveGroupController from "../controllers/move-group-controller";
import * as moveItemController from "../controllers/move-item-controller";

const router = Router();

router.use("/monday", authenticationMiddleware);

router.post("/monday/copywriter", copywriterController.post);
router.post("/monday/move_group", moveGroupController.post);
router.post("/monday/move_item", moveItemController.post);

export default router;
