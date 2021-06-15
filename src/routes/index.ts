import express from "express";
import mondayRoutes from "./monday";
import tuesdayRoutes from "./tuesday";

const router = express.Router();

const getHealth = () => ({
  ok: true,
  message: "Healthy",
});

router.use(mondayRoutes);
router.use(tuesdayRoutes);
router.get("/", (req, res) => {
  res.json(getHealth());
});

router.get("/health", (req, res) => {
  res.json(getHealth());
  res.end();
});

export default router;
