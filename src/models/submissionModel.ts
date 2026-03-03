import mongoose, { Schema, model, Document } from "mongoose";

interface ISubmission extends Document {
  examId: Schema.Types.ObjectId;
  studentName: string;
  imageUrl: string;
  score: number;
  totalCorrect: number;
  status: "pending" | "success" | "error";

  details: [
    {
      question: Number;
      marked: string;
      correct: string;
      status: "correct" | "incorrect" | "invalid";
    },
  ];
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
        question: Number,
        marked: String,
        correct: String,
        status: String,
      },
    ],
  },
  { timestamps: true },
);

const Submission = mongoose.model<ISubmission>("Submission", submissionSchema);

export default Submission;
