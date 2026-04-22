import { describe, it, expect } from "vitest";
import { gradeExam } from "../../modules/Submission/Grade.service.js";

describe("Grade.service", () => {
  it("deve retornar nota máxima e todos os acertos quando todas as respostas estiverem corretas", () => {
    const answerKey = ["A", "B", "C", "D"];
    const studentAnswers = { "1": "A", "2": "B", "3": "C", "4": "D" };

    const result = gradeExam(answerKey, studentAnswers, 4);

    expect(result.score).toBe(10);
    expect(result.totalCorrect).toBe(4);
    expect(result.details.every((d) => d.status === "correct")).toBe(true);
  });

  it("deve calcular a nota proporcional e identificar os erros corretamente", () => {
    const answerKey = ["A", "B", "C", "D"];
    const studentAnswers = { "1": "A", "2": "C", "3": "C" };

    const result = gradeExam(answerKey, studentAnswers, 4);

    expect(result.score).toBe(5);
    expect(result.totalCorrect).toBe(2);
    expect(result.details[1].status).toBe("incorrect");
    expect(result.details[3].marked).toBeNull();
  });

  it("deve lidar com score Infinity/NaN retornando 0 (Zero)", () => {
    const answerKey: string[] = [];
    const studentAnswers = {};

    const result = gradeExam(answerKey, studentAnswers, 0);

    expect(result.score).toBe(0);
    expect(result.totalCorrect).toBe(0);
  });
});
