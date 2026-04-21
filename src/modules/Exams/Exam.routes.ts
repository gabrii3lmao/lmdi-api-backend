import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { ExamController } from "./Exam.controller.js";
import { ExamService } from "./Exam.service.js";
import { ExamRepository } from "./Exam.repository.js";
import { ClassRepository } from "../Classes-/Class.repository.js";
import { SubmissionRepository } from "../Submission/Submission.repository.js";
const examRouter = Router();

const classRepo = new ClassRepository();
const examRepo = new ExamRepository();
const submissionRepo = new SubmissionRepository();
const examService = new ExamService(examRepo, classRepo, submissionRepo);
const examController = new ExamController(examService);

examRouter.use(authMiddleware);

examRouter.post("/", examController.create);
examRouter.put("/:examId", examController.update);
examRouter.delete("/:examId", examController.delete);
examRouter.get("/class/:classId", examController.listByClass);

export default examRouter;
