import mongoose, { Document, Schema, model } from "mongoose";

interface IExam extends Document {
  tittle: string;
  classId: Schema.Types.ObjectId;
  questionCount: number;
  choicesCount: number;
  answerKey: [String];
}

const examSchema = new mongoose.Schema<IExam>({
  tittle: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: "Class" },
  questionCount: Number,
  choicesCount: Number,
  answerKey: [String],
});

const Exam = mongoose.model<IExam>("Exam", examSchema);

export default Exam;
