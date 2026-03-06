import { Router } from "express";
import { upload } from "../config/multer.js";
import { TemplateController } from "../controllers/templateController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const uploadRouter = Router();

// Rotas GET
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

// rota POST
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

uploadRouter.get(
  "/:id",
  authMiddleware,
  TemplateController.listarGabaritosMestre,
);

export default uploadRouter;
