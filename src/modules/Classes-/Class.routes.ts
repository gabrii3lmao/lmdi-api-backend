import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { ClassController } from "./Class.controller.js";
import { ClassService } from "./Class.service.js";
import { ClassRepository } from "./Class.repository.js";
import { SubmissionRepository } from "../Submission/Submission.repository.js";

const submissionRepository = new SubmissionRepository();
const classRepository = new ClassRepository();
const classService = new ClassService(classRepository, submissionRepository);
const classController = new ClassController(classService);

const classRouter = Router();

classRouter.get("/", authMiddleware, classController.getClasses);
classRouter.post("/", authMiddleware, classController.createClass);
classRouter.put("/:id", authMiddleware, classController.updateClass);
classRouter.delete("/:id", authMiddleware, classController.deleteClass);

export default classRouter;
