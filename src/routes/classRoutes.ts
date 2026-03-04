import { Router } from "express";
import ClassController from "../controllers/classController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const classRouter = Router();

classRouter.post("/", authMiddleware, ClassController.create);
classRouter.put("/:id", authMiddleware, ClassController.update);
classRouter.delete("/:id", authMiddleware, ClassController.delete);

export default classRouter;
