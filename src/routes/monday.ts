import { Router } from "express";

import { authenticationMiddleware } from "../middlewares/authentication";
import * as createContentForEpisodeController from "../controllers/createContentForEpisodeController";
import * as moveGroupController from "../controllers/moveGroupController";
import * as moveItemController from "../controllers/moveItemController";
import * as podcastController from "../controllers/podcastController";
import * as duplicateColumnController from "../controllers/duplicateColumnController";

const router = Router();

router.use("/monday", authenticationMiddleware);

router.post("/monday/copywriter", createContentForEpisodeController.post);
router.post("/monday/move_group", moveGroupController.post);
router.post("/monday/move_item", moveItemController.post);
router.post("/monday/copy_podcast_item", podcastController.post);
router.post("/monday/duplicate_column", duplicateColumnController.post);

export default router;
