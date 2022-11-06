import { Router } from "express";

import userRoutes from "../controller/v1/user";

const router = Router();

router.use("/user", userRoutes);

export default router;
