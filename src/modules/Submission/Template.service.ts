import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

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

export async function processarGabaritos(urls: string[]) {
  const prompt = `Analise a imagem deste gabarito.
Extraia as questões e alternativas marcadas.
Retorne ESTRITAMENTE um objeto JSON no formato: {"1": "A", "2": "B"}.
Não inclua nenhuma explicação.
Se uma questão não estiver marcada, ou tiver dupla marcação, use null como valor.`;

  const resultados: Record<string, string | null>[] = [];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Falha ao baixar a imagem da nuvem: ${response.status}`,
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      const mimeType = response.headers.get("content-type") || "image/jpeg";

      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
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
      
      if (urls.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error(`Erro ao processar ${url}:`, error);
      resultados.push({} as any);
    }
  }

  return resultados;
}
