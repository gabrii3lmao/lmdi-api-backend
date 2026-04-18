import Submission, { type ISubmission } from "../../models/submissionModel.js";

export class SubmissionRepository {
  async create(submissionData: Partial<ISubmission>): Promise<ISubmission> {
    return await Submission.create(submissionData);
  }

  async updateStatusAndScore(
    submissionId: string, 
    updateData: Partial<ISubmission>
  ): Promise<ISubmission | null> {
    return await Submission.findByIdAndUpdate(
      submissionId, 
      updateData, 
      { new: true } 
    );
  }

  async findByExamId(examId: string) {
    return await Submission.find({ examId });
  }

  async findByIdAndClassId(id: string, classId: string) {
    return await Submission.findOne({
      _id: id,
      classId: classId,
    });
  }

  async findByClass(classId: string) {
    return await Submission.find({ classId });
  }

}