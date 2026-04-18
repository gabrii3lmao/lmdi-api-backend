import Exam, { type IExam } from "../../models/examModel.js";

export class ExamRepository {
  async create(examData: Partial<IExam>): Promise<IExam> {
    return await Exam.create(examData);
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
