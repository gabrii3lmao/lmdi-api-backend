interface IGraderResult {
  totalCorrect: number;
  score: number;
  details: any[];
}
export const gradeExam = (
  answerKey: string[],
  studentAnswers: Record<string, string | null>,
  totalQuestions: number,
): IGraderResult => {
  let totalCorrect = 0;

  const details = answerKey.map((correctAnswer, index) => {
    const questionNum = (index + 1).toString();
    const marked = studentAnswers[questionNum] ?? null;
    const isCorrect = marked === correctAnswer;

    if (isCorrect) totalCorrect++;

    return {
      question: index + 1,
      marked,
      correct: correctAnswer,
      status: isCorrect ? "correct" : "incorrect",
    };
  });

  // 1. Proteção contra divisão por zero ou undefined.
  // Se totalQuestions for falso (0, null, undefined), ele usa o tamanho do answerKey.
  // Se o answerKey também for vazio (o que é improvável), ele usa 1 como último recurso.
  const safeTotalQuestions = totalQuestions || answerKey.length || 1;

  // 2. Calcula a nota
  const rawScore = (totalCorrect / safeTotalQuestions) * 10;

  // 3. Garante que se, por algum motivo absurdo, ainda der NaN ou Infinity, a nota será 0.
  const finalScore =
    Number.isNaN(rawScore) || !Number.isFinite(rawScore)
      ? 0
      : Number(rawScore.toFixed(2));

  return {
    totalCorrect,
    score: finalScore,
    details,
  };
};
