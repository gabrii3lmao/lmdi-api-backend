import express from "express";

import authRouter from "./authRoutes.js";
import uploadRouter from "./uploadRoutes.js";

const Router = express.Router();

Router.use("/auth", authRouter);
Router.use(uploadRouter);

export default Router;
