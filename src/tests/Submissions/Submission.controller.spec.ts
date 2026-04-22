import { describe, it, expect, vi, beforeEach } from "vitest";
import { SubmissionController } from "../../modules/Submission/Submission.controller.js";
import type { SubmissionService } from "../../modules/Submission/Submission.service.js";
import type { Request, Response } from "express";

describe("SubmissionController", () => {
  let mockService: Partial<SubmissionService>;
  let controller: SubmissionController;
  let req: Partial<Request & { user?: any }>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockService = {
      processSubmissions: vi.fn(),
      getSubmissionsByExam: vi.fn(),
      getSubmissionsByClass: vi.fn(),
    };
    controller = new SubmissionController(mockService as SubmissionService);

    req = {
      body: {},
      params: {},
      query: {},
      user: { id: "teacher-123" },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  describe("createSubmission", () => {
    it("deve retornar 401 se não houver teacherId", async () => {
      req.user = undefined;

      await controller.createSubmission(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Não autenticado" });
    });

    it("deve retornar 400 se faltar examId", async () => {
      await controller.createSubmission(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "examId é obrigatório" });
    });

    it("deve retornar 400 se faltarem arquivos (files)", async () => {
      req.body.examId = "exam-123";
      // req.files ausente

      await controller.createSubmission(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Nenhuma imagem" });
    });

    it("deve retornar 403 se o exame não for encontrado no serviço", async () => {
      req.body.examId = "exam-123";
      req.files = [{ path: "/img.jpg" }] as any;

      vi.mocked(mockService.processSubmissions!).mockRejectedValue(
        new Error("EXAM_NOT_FOUND"),
      );

      await controller.createSubmission(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Exame não encontrado/autorizado",
      });
    });

    it("deve retornar 200 com os resultados em caso de sucesso", async () => {
      req.body.examId = "exam-123";
      req.files = [{ path: "/img.jpg" }] as any;
      const mockResult = [{ id: "sub-1" }];

      vi.mocked(mockService.processSubmissions!).mockResolvedValue(
        mockResult as any,
      );

      await controller.createSubmission(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe("getAllSubmissions", () => {
    it("deve retornar 500/erro se o zod falhar no examId", async () => {
      // req.query.examId ausente
      await controller.getAllSubmissions(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao listar submissões",
      });
    });

    it("deve retornar 200 com as submissões", async () => {
      req.query!.examId = "exam-123";
      vi.mocked(mockService.getSubmissionsByExam!).mockResolvedValue([
        { id: "sub-1" },
      ] as any);

      await controller.getAllSubmissions(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: "sub-1" }]);
    });
  });
});
