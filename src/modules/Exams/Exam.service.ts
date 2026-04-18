import { ExamRepository } from "./Exam.repository.js";
import type { IExam } from "./Exam.model.js";
import type { ExamValidationType } from "./dto/create-exam.js";
import { ClassRepository } from "../Classes-/Class.repository.js";

export class ExamService {
  constructor(private readonly _examRepository: ExamRepository, private readonly _classRepository: ClassRepository) {}

  async createExam(
    examData: ExamValidationType,
    teacherId: string,
  ): Promise<IExam> {
    
    const classExists = await this._classRepository.findById(examData.classId);

    if (!classExists) {
      throw new Error("CLASS_NOT_FOUND");
    }

    if (classExists.teacherId.toString() !== teacherId) {
      throw new Error("UNAUTHORIZED");
    }

    return await this._examRepository.create({
      ...examData,
      teacherId,
    });
  }

  async getExamsByClass(classId: string): Promise<IExam[]> {
    return await this._examRepository.findByClassId(classId);
  }
}
