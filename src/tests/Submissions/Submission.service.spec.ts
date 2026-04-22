import { describe, it, expect, vi, beforeEach } from "vitest";
import { SubmissionService } from "../../modules/Submission/Submission.service.js";
import type { ExamRepository } from "../../modules/Exams/Exam.repository.js";
import type { SubmissionRepository } from "../../modules/Submission/Submission.repository.js";

// Mocks externos
vi.mock("../../modules/Submission/Template.service.js", () => ({
  processarGabaritos: vi.fn(),
}));

vi.mock("../../modules/Submission/Grade.service.js", () => ({
  gradeExam: vi.fn(),
}));

import { processarGabaritos } from "../../modules/Submission/Template.service.js";
import { gradeExam } from "../../modules/Submission/Grade.service.js";

describe("SubmissionService", () => {
  let examRepoMock: Partial<ExamRepository>;
  let subRepoMock: Partial<SubmissionRepository>;
  let service: SubmissionService;

  beforeEach(() => {
    examRepoMock = { findByIdAndTeacher: vi.fn() };
    subRepoMock = {
      create: vi.fn(),
      updateStatusAndScore: vi.fn(),
      findByClass: vi.fn(),
      findByExamId: vi.fn(),
    };

    service = new SubmissionService(
      examRepoMock as ExamRepository,
      subRepoMock as SubmissionRepository,
    );
    vi.clearAllMocks();
  });

  describe("processSubmissions", () => {
    const mockFiles = [
      { path: "/tmp/prova.jpg", originalname: "Maria.jpg" },
    ] as any[];

    it("deve lançar erro se o exame não for encontrado", async () => {
      vi.mocked(examRepoMock.findByIdAndTeacher!).mockResolvedValue(null);

      await expect(
        service.processSubmissions("exam-1", "teacher-1", mockFiles),
      ).rejects.toThrow("EXAM_NOT_FOUND");
    });

    it("deve processar submissões com sucesso e atualizar para 'success'", async () => {
      const mockExam = {
        _id: "exam-1",
        classId: "class-1",
        answerKey: ["A"],
        questionsCount: 1,
      };
      const mockCreatedSub = { _id: "sub-1" };
      const mockUpdatedSub = { _id: "sub-1", score: 10 };

      vi.mocked(examRepoMock.findByIdAndTeacher!).mockResolvedValue(
        mockExam as any,
      );
      vi.mocked(subRepoMock.create!).mockResolvedValue(mockCreatedSub as any);
      vi.mocked(processarGabaritos).mockResolvedValue([{ "1": "A" }]);
      vi.mocked(gradeExam).mockReturnValue({
        totalCorrect: 1,
        score: 10,
        details: [],
      });
      vi.mocked(subRepoMock.updateStatusAndScore!).mockResolvedValue(
        mockUpdatedSub as any,
      );

      const result = await service.processSubmissions(
        "exam-1",
        "teacher-1",
        mockFiles,
      );

      // Verifica criação inicial com status pending
      expect(subRepoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          studentName: "Maria",
          status: "pending",
        }),
      );

      // Verifica chamada da IA
      expect(processarGabaritos).toHaveBeenCalledWith(["/tmp/prova.jpg"]);

      // Verifica chamada de update com a nota
      expect(subRepoMock.updateStatusAndScore).toHaveBeenCalledWith(
        "sub-1",
        expect.objectContaining({
          status: "success",
          score: 10,
        }),
      );

      expect(result).toEqual([mockUpdatedSub]);
    });

    it("deve processar submissões e atualizar para 'error' se a IA não retornar nada", async () => {
      const mockExam = { _id: "exam-1", classId: "class-1" };
      const mockCreatedSub = { _id: "sub-1" };

      vi.mocked(examRepoMock.findByIdAndTeacher!).mockResolvedValue(
        mockExam as any,
      );
      vi.mocked(subRepoMock.create!).mockResolvedValue(mockCreatedSub as any);

      // Simula a IA retornando vazio
      vi.mocked(processarGabaritos).mockResolvedValue([{}]);
      vi.mocked(subRepoMock.updateStatusAndScore!).mockResolvedValue({
        _id: "sub-1",
        status: "error",
      } as any);

      await service.processSubmissions("exam-1", "teacher-1", mockFiles);

      expect(subRepoMock.updateStatusAndScore).toHaveBeenCalledWith("sub-1", {
        status: "error",
      });
    });
  });
});
