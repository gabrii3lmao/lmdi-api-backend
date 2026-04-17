import express from "express";

import authRouter from "../modules/Users/User.routes.js";
import uploadRouter from "./uploadRoutes.js";
import classRouter from "./classRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/exams", uploadRouter);
router.use("/classes", classRouter);

export default router;
