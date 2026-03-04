import type { Request, Response } from "express";
import Class from "../models/classModel.js";

interface AuthRequest extends Request {
  user?: { id: string };
}

export default class ClassController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const { name } = req.body;
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (!name) {
        return res.status(400).json({ error: "O nome é obrigatório" });
      }

      const classe = await Class.create({ name, teacherId });

      return res.status(201).json({
        message: "Turma criada com sucesso",
        classe,
      });
    } catch (error) {
      console.error("Erro ao criar turma:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const turma = await Class.findById(id);

      if (!turma) {
        return res.status(404).json({ error: "Turma não encontrada" });
      }

      if (turma.teacherId.toString() !== teacherId) {
        return res.status(403).json({ error: "Não autorizado" });
      }

      if (!name) {
        return res.status(400).json({ error: "Nome é obrigatório" });
      }

      turma.name = name;
      await turma.save();

      return res.status(200).json({
        message: "Turma atualizada com sucesso",
        turma,
      });
    } catch (error) {
      console.error("Erro ao atualizar turma:", error);
      return res.status(500).json({ error: "Erro na atualização da turma" });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const turma = await Class.findById(id);

      if (!turma) {
        return res.status(404).json({ error: "Turma não encontrada" });
      }

      if (turma.teacherId.toString() !== teacherId) {
        return res.status(403).json({ error: "Não autorizado" });
      }

      await Class.findByIdAndDelete(id);

      return res.status(200).json({
        message: "Turma deletada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar turma:", error);
      return res.status(500).json({ error: "Erro na remoção da turma" });
    }
  }
}
