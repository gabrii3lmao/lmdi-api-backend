import type { Request, Response } from "express";
import Submission, { type ISubmission } from "../models/submissionModel.js";
import Exam from "../models/examModel.js";
import { processarGabaritos } from "../services/templateService.js";
import { gradeExam } from "../services/examService.js";

interface AuthRequest extends Request {
  user?: { id: string };
}

export class TemplateController {
  static async cadastroAluno(req: AuthRequest, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      const { examId } = req.body;
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (!examId) {
        return res.status(400).json({ error: "examId é obrigatório" });
      }

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "Nenhuma imagem enviada" });
      }

      const exam = await Exam.findOne({
        _id: examId,
        teacherId,
      });

      if (!exam) {
        return res.status(403).json({ error: "Exame não encontrado" });
      }

      const submissoes = await Promise.all(
        files.map((file) =>
          Submission.create({
            examId,
            classId: exam.classId,
            studentName: file.originalname.split(".")[0],
            imageUrl: file.path,
            status: "pending",
          }),
        ),
      );

      const caminhos = files.map((f) => f.path);
      const resultadosIA = await processarGabaritos(caminhos);

      for (let i = 0; i < submissoes.length; i++) {
        const sub: ISubmission = submissoes[i];
        const marcacoesAluno = resultadosIA[i] || null;

        if (!marcacoesAluno || Object.keys(marcacoesAluno).length === 0) {
          sub.status = "error";
        } else {
          const result = gradeExam(
            exam.answerKey,
            marcacoesAluno,
            exam.questionsCount,
          );

          sub.totalCorrect = result.totalCorrect;
          sub.score = result.score;
          sub.details = result.details;
          sub.status = "success";
        }

        await sub.save();
      }

      return res.status(200).json(submissoes);
    } catch (error) {
      console.error("Erro no cadastroAluno:", error);
      return res.status(500).json({
        error: "Erro interno ao processar gabaritos",
      });
    }
  }

  static async cadastrarGabaritoMestre(req: AuthRequest, res: Response) {
    try {
      const { title, classId, questionsCount, choicesCount, answerKey } =
        req.body;

      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (!title || !classId || !answerKey) {
        return res
          .status(400)
          .json({ error: "Informações obrigatórias ausentes" });
      }

      const exam = await Exam.create({
        title,
        classId,
        questionsCount,
        choicesCount,
        answerKey,
        teacherId,
      });

      return res.status(201).json({
        message: "Gabarito criado com sucesso",
        exam,
      });
    } catch (error) {
      console.error("Erro ao criar gabarito:", error);
      return res.status(500).json({ error: "Erro ao criar gabarito" });
    }
  }
}
