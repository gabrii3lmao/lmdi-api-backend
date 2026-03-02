import express from "express";
import authRouter from "./authRoutes.js";
const Router = express.Router();

Router.use("/auth", authRouter);

export default Router;
