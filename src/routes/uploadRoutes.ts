import { Router } from "express";
import { upload } from "../config/multer.js";
import { TemplateController } from "../controllers/templateController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const uploadRouter = Router();

uploadRouter.post(
  "/create-exam",
  authMiddleware,
  TemplateController.cadastrarGabaritoMestre,
);

uploadRouter.post(
  "/submission",
  authMiddleware,
  upload.array("files"),
  TemplateController.cadastroAluno,
);

export default uploadRouter;
