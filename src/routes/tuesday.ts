import { Router } from "express";

import { post } from "../controllers/tuesday-controller";
import { authenticationMiddleware } from "../middlewares/authentication";

const router = Router();

router.post("/execute_action", authenticationMiddleware, post);

export default router;
