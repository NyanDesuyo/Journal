import { Router } from "express";

const router = Router();

import authRoutes from "../controller/v1/Auth";
router.use("/auth", authRoutes);

import PostItRoutes from "../controller/v1/PostIt";
router.use("/postit", PostItRoutes);

export default router;
