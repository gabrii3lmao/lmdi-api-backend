import type { Request, Response } from "express";
import { ClassService } from "./Class.service.js";
import { classValidationSchema } from "./dto/create-class.js";
import { ZodError } from "zod";
import { deleteFiles } from "../../config/multer.js";

interface AuthRequest extends Request {
  user?: { id: string };
}

export class ClassController {
  constructor(private readonly _classService: ClassService) {}

  createClass = async (req: AuthRequest, res: Response) => {
    try {
      const teacherId = req.user?.id;
      if (!teacherId)
        return res.status(401).json({ error: "Usuário não autenticado" });

      const classData = classValidationSchema.parse(req.body);

      const newClass = await this._classService.createClass({
        ...classData,
        teacherId,
      });

      return res
        .status(201)
        .json({ message: "Turma criada com sucesso", classe: newClass });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getClasses = async (req: AuthRequest, res: Response) => {
    try {
      const teacherId = req.user?.id;
      if (!teacherId)
        return res.status(401).json({ error: "Usuário não autenticado" });

      const classes = await this._classService.findAllByTeacher(teacherId);

      return res.status(200).json(classes);
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  updateClass = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const teacherId = req.user?.id;
      if (!teacherId)
        return res.status(401).json({ error: "Usuário não autenticado" });

      const classData = classValidationSchema.parse(req.body);

      const updatedClass = await this._classService.updateClass(
        id as string,
        classData,
        teacherId,
      );

      return res
        .status(200)
        .json({ message: "Turma atualizada com sucesso", turma: updatedClass });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  deleteClass = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const teacherId = req.user?.id;
      if (!teacherId)
        return res.status(401).json({ error: "Usuário não autenticado" });

      
      const imagesToClean = await this._classService.deleteClass(id as string, teacherId);

      deleteFiles(imagesToClean).catch((err) =>
        console.error("Erro ao limpar arquivos da turma deletada:", err),
      );

      return res.status(200).json({ message: "Turma deletada com sucesso" });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  private handleError(res: Response, error: any) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ error: "Dados inválidos", details: error.format() });
    }
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Turma não encontrada" });
    }
    if (error.message === "UNAUTHORIZED") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
