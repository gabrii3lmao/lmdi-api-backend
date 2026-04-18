import { Router } from "express";
import { upload } from "../../config/multer.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { SubmissionController } from "./Submission.controller.js";
import { SubmissionService } from "./Submission.service.js";
import { SubmissionRepository } from "./Submission.repository.js";
import { ExamRepository } from "../Exams/Exam.repository.js";

const submissionRouter = Router();

const examRepo = new ExamRepository();
const submissionRepo = new SubmissionRepository();
const submissionService = new SubmissionService(examRepo, submissionRepo);
const submissionController = new SubmissionController(submissionService);

submissionRouter.use(authMiddleware);

submissionRouter.post("/", upload.array("files"), submissionController.createSubmission);

submissionRouter.get("/", submissionController.getAllSubmissions);

export default submissionRouter;