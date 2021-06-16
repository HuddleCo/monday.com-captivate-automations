import { Router } from "express";

import { post } from "../controllers/monday-controller";

const router = Router();

router.post("/execute_action", post);

export default router;
