import { Router } from "express";
import { upload } from "../config/multer.js";
import { TemplateController } from "../controllers/templateController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const uploadRouter = Router();

// rota 1: Cadastro do gabarito mestre
uploadRouter.post(
  "/create-exam",
  authMiddleware,
  TemplateController.cadastrarGabaritoMestre,
);

// rota 2: Cadastro das provas dos alunos
uploadRouter.post(
  "/submission",
  authMiddleware,
  upload.array("files"),
  TemplateController.cadastroAluno,
);

export default uploadRouter;
