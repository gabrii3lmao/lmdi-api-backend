import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function extrairJSONSeguro(texto: string): string {
  const match = texto.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Nenhum JSON encontrado na resposta do modelo.");
  }
  return match[0];
}

function detectarMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  throw new Error("Formato de imagem não suportado.");
}

export async function processarGabaritos(caminhos: string[]) {
  const prompt = `Analise a imagem deste gabarito.
Extraia as questões e alternativas marcadas.
Retorne ESTRITAMENTE um objeto JSON no formato: {"1": "A", "2": "B"}.
Não inclua nenhuma explicação.
Se uma questão não estiver marcada, ou tiver dupla marcação, use null como valor.`;

  const resultados: Record<string, string | null>[] = [];

  for (const caminho of caminhos) {
    try {
      const imageBuffer = await fs.readFile(caminho);
      const mimeType = detectarMimeType(caminho);

      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: imageBuffer.toString("base64"),
                  mimeType,
                },
              },
            ],
          },
        ],
      });

      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("Resposta vazia do modelo.");
      }

      const jsonString = extrairJSONSeguro(rawText);
      resultados.push(JSON.parse(jsonString));

      if (caminhos.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error(`Erro ao processar ${caminho}:`, error);
      resultados.push({} as any);
    }
  }

  return resultados;
}

const paths = [
  "/home/gabrii3l/Coding/projetos/LMDI-true/backend/src/services/imgs/aluno.jpg",
  "/home/gabrii3l/Coding/projetos/LMDI-true/backend/src/services/imgs/aluno2.png",
  "/home/gabrii3l/Coding/projetos/LMDI-true/backend/src/services/imgs/aluno3.png",
  "/home/gabrii3l/Coding/projetos/LMDI-true/backend/src/services/imgs/aluno4.png",
];
const response = await processarGabaritos(paths);
console.log(response);
