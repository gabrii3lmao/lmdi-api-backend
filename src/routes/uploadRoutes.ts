import { Router } from "express";
import { upload } from "../config/multer.js";
import { TemplateController } from "../controllers/templateController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const uploadRouter = Router();
// Rota 1: Criar gabarito mestre
uploadRouter.post(
  "/create-exam",
  authMiddleware,
  TemplateController.cadastrarGabaritoMestre,
);

// rota 2: listar e criar gabarito dos alunos
uploadRouter.get(
  "/submission",
  authMiddleware,
  TemplateController.listarSubmissoes,
);

uploadRouter.get(
  "/submission/:id",
  authMiddleware,
  TemplateController.listarSubmissao,
);

uploadRouter.post(
  "/submission",
  authMiddleware,
  upload.array("files"),
  TemplateController.cadastroAluno,
);


export default uploadRouter;
