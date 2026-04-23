import type { Request, Response } from "express";
import type { SubmissionService } from "./Submission.service.js";
import z from "zod";
interface AuthRequest extends Request {
  user?: { id: string };
}

export class SubmissionController {
  constructor(private readonly _submissionService: SubmissionService) {}

  createSubmission = async (req: AuthRequest, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      const { examId } = req.body;
      const teacherId = req.user?.id;

      if (!teacherId) return res.status(401).json({ error: "Não autenticado" });
      if (!examId)
        return res.status(400).json({ error: "examId é obrigatório" });
      if (!files?.length)
        return res.status(400).json({ error: "Nenhuma imagem" });

      const results = await this._submissionService.processSubmissions(
        examId,
        teacherId,
        files,
      );

      return res.status(200).json(results);
    } catch (error: any) {
      if (error.message === "EXAM_NOT_FOUND") {
        return res
          .status(403)
          .json({ error: "Exame não encontrado/autorizado" });
      }
      return res.status(500).json({ error: "Erro interno na correção" });
    }
  };

  getAllSubmissions = async (req: AuthRequest, res: Response) => {
    try {
      const examId = z.string().parse(req.query.examId);
      if (!examId)
        return res.status(400).json({ error: "examId é obrigatório" });

      const submissions = await this._submissionService.getSubmissionsByExam(
        examId as string,
      );
      return res.status(200).json(submissions);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar submissões" });
    }
  };

  getSubmissionsByClass = async (req: AuthRequest, res: Response) => {
    try {
      const classId = z.string().parse(req.params.classId);
      if (!classId)
        return res.status(400).json({ error: "classId é obrigatório" });

      const submissions = await this._submissionService.getSubmissionsByClass(
        classId as string,
      );

      return res.status(200).json(submissions);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao listar submissões por turma" });
    }
  };

  getSubmissionAnswers = async (req: AuthRequest, res: Response) => {
    try {
      const submissionId = z.string().parse(req.params.submissionId);
      if (!submissionId)
        return res.status(400).json({ error: "submissionId é obrigatório" });

      const answers = await this._submissionService.getSubmissionaAnswers(
        submissionId as string,
      );

      if (!answers) {
        return res.status(404).json({ error: "Submissão não encontrada" });
      }

      return res.status(200).json({ answers });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao obter respostas da submissão" });
    }
  };
}
