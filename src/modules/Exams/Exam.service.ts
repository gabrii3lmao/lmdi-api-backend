import { ExamRepository } from "./Exam.repository.js";
import type { IExam } from "./Exam.model.js";
import type { ExamValidationType } from "./dto/create-exam.js";
import { ClassRepository } from "../Classes-/Class.repository.js";

export class ExamService {
  constructor(
    private readonly _examRepository: ExamRepository,
    private readonly _classRepository: ClassRepository,
  ) {}

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

  async updateExam(
    examId: string,
    updateData: Partial<ExamValidationType>,
    teacherId: string,
  ): Promise<IExam | null> {
    const exam = await this._examRepository.findByIdAndTeacher(
      examId,
      teacherId,
    );

    if (!exam) {
      throw new Error("EXAM_NOT_FOUND_OR_UNAUTHORIZED");
    }

    return await this._examRepository.update(examId, updateData);
  }

  async deleteExam(examId: string, teacherId: string): Promise<void> {
    const exam = await this._examRepository.findByIdAndTeacher(
      examId,
      teacherId,
    );

    if (!exam) {
      throw new Error("EXAM_NOT_FOUND_OR_UNAUTHORIZED");
    }

    await this._examRepository.delete(examId);
  }

  async getExamsByClass(classId: string): Promise<IExam[]> {
    return await this._examRepository.findByClassId(classId);
  }
}
