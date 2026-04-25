import Exam, { type IExam } from "./Exam.model.js";

export class ExamRepository {
  async create(examData: Partial<IExam>): Promise<IExam> {
    return await Exam.create(examData);
  }

  async update(
    examId: string,
    updateData: Partial<IExam>,
  ): Promise<IExam | null> {
    return await Exam.findByIdAndUpdate(examId, updateData, { returnDocument: "after" });
  }

  async delete(examId: string): Promise<void> {
    await Exam.findByIdAndDelete(examId);
  }

  async findByIdAndTeacher(examId: string, teacherId: string) {
    return await Exam.findOne({
      _id: examId,
      teacherId,
    });
  }

  async findByClassId(classId: string) {
    return await Exam.find({ classId });
  }
}
