import type { Request, Response } from "express";
import Submission from "../models/submissionModel.js";
import Exam from "../models/examModel.js"; // Importe seu model de Exam
import { processarGabaritos } from "../services/templateService.js";

export class TemplateController {
  static async cadastroAluno(req: Request, res: Response) {
    const files = req.files as Express.Multer.File[];
    const { examId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    try {
      // 1. Busca o gabarito oficial para comparação
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ error: "Exame não encontrado" });
      }

      // 2. Cria as submissões iniciais no banco (para dar feedback rápido ao user)
      const submissoesPromises = files.map((file) => {
        return Submission.create({
          examId: examId,
          studentName: file.originalname.split(".")[0], // Usa o nome do arquivo como nome provisório
          imageUrl: file.path,
          status: "pending",
        });
      });

      const submissoes = await Promise.all(submissoesPromises);

      // 3. Processamento em Background (ou sequencial aqui para simplificar)
      // Passamos os caminhos dos arquivos para o seu service
      const caminhos = files.map((f) => f.path);
      const resultadosIA = await processarGabaritos(caminhos);

      // 4. Lógica de Correção e Atualização
      for (let i = 0; i < submissoes.length; i++) {
        const sub = submissoes[i];
        const marcacoesAluno = resultadosIA[i]; // Ex: {"1": "A", "2": "B"}

        if (!marcacoesAluno || Object.keys(marcacoesAluno).length === 0) {
          sub.status = "error";
          await sub.save();
          continue;
        }

        let acertos = 0;
        const detalhes = [];

        // Comparamos o que o Gemini extraiu com o answerKey do Exame
        // Supondo que exam.answerKey seja um array: ["A", "B", "C"]
        exam.answerKey.forEach((respostaCorreta, index) => {
          const questaoNum = (index + 1).toString();
          const marcada = marcacoesAluno[questaoNum] || null;
          const eCorreto = marcada === respostaCorreta;

          if (eCorreto) acertos++;

          detalhes.push({
            question: parseInt(questaoNum),
            marked: marcada,
            correct: respostaCorreta,
            status: eCorreto ? "correct" : "incorrect",
          });
        });

        // Atualiza a submissão com os dados reais
        sub.totalCorrect = acertos;
        sub.score = (acertos / exam.questionCount) * 10;
        sub.details = detalhes as any;
        sub.status = "success";
        await sub.save();
      }

      // Retorna as submissões já processadas (ou o estado inicial se preferir async)
      return res.json(submissoes);
    } catch (error: any) {
      console.error("Erro no cadastroAluno:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao processar gabaritos" });
    }
  }

  static async cadastrarGabaritoMestre(req: Request, res: Response) {
    try {
      const { title, classId, questionsCount, choicesCount, answerKey } =
        req.body;
      if (!title || !classId || !answerKey) {
        return res
          .status(400)
          .json({ error: "Está faltando informações cruciais" });
      }

      const gabaritoMestre = await Exam.create({
        title,
        classId,
        questionsCount,
        choicesCount,
        answerKey,
      });

      return res.status(201).json({
        message: "Gabarito criado com sucesso!",
        exam: gabaritoMestre,
      });
    } catch (error) {
      console.log(`Erro ao criar gabarito: ${error}`);
      return res.status(500).json({ error: "Erro ao criar gabarito" });
    }
  }
}
