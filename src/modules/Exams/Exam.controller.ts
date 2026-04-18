import type { Request, Response } from "express";
import type { ExamService } from "./Exam.service.js";


export class ExamController {
  constructor(private readonly _examService: ExamService) {
    this.create = this.create.bind(this);
    this.listByClass = this.listByClass.bind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const teacherId = req.user?.id;
      if (!teacherId) return res.status(401).json({ error: "Não autenticado" });

      const exam = await this._examService.createExam(
        { ...req.body },
        teacherId,
      );
      return res.status(201).json({ message: "Gabarito criado", exam });
    } catch (error: any) {
      this.handleError(res, error);
    }
  }

  async listByClass(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const exams = await this._examService.getExamsByClass(classId as string);
      return res.status(200).json(exams);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  private handleError(res: Response, error: any) {
      if (error.message === "CLASS_NOT_FOUND") {
        return res.status(404).json({ error: "Classe não encontrada" });
      }
      if (error.message === "UNAUTHORIZED") {
        return res.status(403).json({ error: "Não autorizado" });
      }
      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
}
