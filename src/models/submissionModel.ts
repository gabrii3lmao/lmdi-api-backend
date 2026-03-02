import mongoose, { Schema, model, Document } from "mongoose";

interface ISubmission extends Document {
    examId: Schema.Types.ObjectId;
    studentName: string;
    imageUrl: String;
    score: 
}