import { describe, it, expect, vi, beforeEach } from "vitest";
import { SubmissionRepository } from "../../modules/Submission/Submission.repository.js";
import Submission from "../../modules/Submission/Submission.model.js";

// Mock do Mongoose Model
vi.mock("../../modules/Submission/Submission.model.js", () => {
  return {
    default: {
      create: vi.fn(),
      findByIdAndUpdate: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      deleteMany: vi.fn(),
      findById: vi.fn(),
    },
  };
});

describe("SubmissionRepository", () => {
  let repository: SubmissionRepository;

  beforeEach(() => {
    repository = new SubmissionRepository();
    vi.clearAllMocks();
  });

  it("deve criar uma submissão", async () => {
    const mockData = { examId: "123", studentName: "João" };
    vi.mocked(Submission.create).mockResolvedValue(mockData as any);

    const result = await repository.create(mockData);

    expect(Submission.create).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockData);
  });

  it("deve atualizar status e nota", async () => {
    const updateData = { score: 8, status: "success" as const };
    vi.mocked(Submission.findByIdAndUpdate).mockResolvedValue(
      updateData as any,
    );

    const result = await repository.updateStatusAndScore("sub-1", updateData);

    expect(Submission.findByIdAndUpdate).toHaveBeenCalledWith(
      "sub-1",
      updateData,
      { new: true },
    );
    expect(result).toEqual(updateData);
  });

  it("deve buscar submissões por examId", async () => {
    const mockArray = [{ _id: "1" }];
    vi.mocked(Submission.find).mockResolvedValue(mockArray as any);

    const result = await repository.findByExamId("exam-1");

    expect(Submission.find).toHaveBeenCalledWith({ examId: "exam-1" });
    expect(result).toEqual(mockArray);
  });

  it("deve buscar as respostas (marked) de uma submissão por ID", async () => {
    const mockDetails = [
      { question: 1, marked: "A" },
      { question: 2, marked: "B" },
      { question: 3, marked: null },
    ];

    const leanMock = vi.fn().mockResolvedValue({
      details: mockDetails,
    });

    const selectMock = vi.fn().mockReturnValue({
      lean: leanMock,
    });

    vi.mocked(Submission.findById).mockReturnValue({
      select: selectMock,
    } as any);

    const result = await repository.getSubmissionsAnswersById("sub-1");

    expect(Submission.findById).toHaveBeenCalledWith("sub-1");
    expect(selectMock).toHaveBeenCalledWith("details");
    expect(leanMock).toHaveBeenCalled();

    expect(result).toEqual(["A", "B", null]);
  });
});
