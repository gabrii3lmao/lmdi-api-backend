import type { ExamRepository } from "../Exams/Exam.repository.js";
import type { SubmissionRepository } from "./Submission.repository.js";
import { processarGabaritos } from "./Template.service.js";
import { gradeExam } from "./Grade.service.js";

export class SubmissionService {
  constructor(
    private readonly _examRepo: ExamRepository,
    private readonly _submissionRepo: SubmissionRepository,
  ) {}

  async processSubmissions(
    examId: string,
    teacherId: string,
    files: Express.Multer.File[],
  ) {
    const exam = await this._examRepo.findByIdAndTeacher(examId, teacherId);

    if (!exam) {
      throw new Error("EXAM_NOT_FOUND");
    }

    const filePaths = files.map((f) => f.path);

    const pendingSubmissions = await Promise.all(
      files.map((file) =>
        this._submissionRepo.create({
          examId,
          classId: exam.classId,
          studentName: file.originalname.split(".")[0], // Tira o ".jpg" / ".pdf" do nome
          imageUrl: file.path,
          status: "pending",
        }),
      ),
    );

    const iaResults = await processarGabaritos(filePaths);

    const finalResults = [];

    for (let i = 0; i < pendingSubmissions.length; i++) {
      const submission = pendingSubmissions[i];
      const studentMarks = iaResults[i];

      let updateData: any = {};

      if (!studentMarks || Object.keys(studentMarks).length === 0) {
        updateData = { status: "error" };
      } else {
        const gradeResult = gradeExam(
          exam.answerKey,
          studentMarks,
          exam.questionsCount,
        );

        updateData = {
          status: "success",
          totalCorrect: gradeResult.totalCorrect,
          score: gradeResult.score,
          details: gradeResult.details,
        };
      }

      const updatedSubmission = await this._submissionRepo.updateStatusAndScore(
        submission._id.toString(),
        updateData,
      );

      finalResults.push(updatedSubmission);
    }

    return finalResults;
  }

  async getSubmissionsByClass(classId: string) {
    return await this._submissionRepo.findByClass(classId);
  }

  async getSubmissionsByExam(examId: string) {
    return await this._submissionRepo.findByExamId(examId);
  }
}
