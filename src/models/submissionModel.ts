import mongoose, { Schema, model, Document } from "mongoose";

interface ISubmissionDetail {
  question: number;
  marked: string | null;
  correct: string;
  status: "correct" | "incorrect" | "invalid";
}

interface ISubmission extends Document {
  examId: Schema.Types.ObjectId;
  studentName: string;
  imageUrl: string;
  score: number;
  totalCorrect: number;
  status: "pending" | "success" | "error";
  details: ISubmissionDetail[];
}

const submissionSchema = new mongoose.Schema<ISubmission>(
  {
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    studentName: { type: String, required: true },
    imageUrl: { type: String },

    score: { type: Number },
    totalCorrect: { type: Number },
    status: {
      type: String,
      enum: ["pending", "success", "error"],
      default: "pending",
    },

    details: [
      {
        question: { type: Number },
        marked: { type: String },
        correct: { type: String },
        status: {
          type: String,
          enum: ["correct", "incorrect", "invalid"],
        },
      },
    ],
  },
  { timestamps: true },
);

const Submission = mongoose.model<ISubmission>("Submission", submissionSchema);

export default Submission;
