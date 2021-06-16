import express from "express";
import mondayRoutes from "./monday";

const router = express.Router();

router.use(mondayRoutes);

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    message: "Healthy",
  });
  res.end();
});

router.get("/error", () => {
  throw new Error("Sentry Error!");
});

export default router;
