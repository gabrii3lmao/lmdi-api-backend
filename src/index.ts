import express from "express";
import Router from "./routes/Router.js";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));
app.use(Router);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("Connected to MongoDB!");

    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
