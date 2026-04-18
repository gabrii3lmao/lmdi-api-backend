import { ExamRepository } from "./Exam.repository.js";
import type { IExam } from "../../models/examModel.js";
import type { ExamValidationType } from "./dto/create-exam.js";

export class ExamService {
  constructor(private readonly _examRepository: ExamRepository) {}

  async createExam(
    examData: ExamValidationType,
    teacherId: string,
  ): Promise<IExam> {
    return await this._examRepository.create({
      ...examData,
      teacherId,
    });
  }

  async getExamsByClass(classId: string): Promise<IExam[]> {
    return await this._examRepository.findByClassId(classId);
  }
}
