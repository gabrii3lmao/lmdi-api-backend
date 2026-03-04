import mongoose, { Document, Schema, model } from "mongoose";

interface IExam extends Document {
  title: string;
  classId: Schema.Types.ObjectId;
  questionsCount: number;
  choicesCount: number;
  answerKey: string[];
  teacherId: Schema.Types.ObjectId;
}

const examSchema = new mongoose.Schema<IExam>(
  {
    title: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    questionsCount: Number,
    choicesCount: Number,
    answerKey: [String],
    teacherId: {type: Schema.Types.ObjectId, ref: "User", required: true},
  },
  { timestamps: true },
);

const Exam = mongoose.model<IExam>("Exam", examSchema);

export default Exam;
