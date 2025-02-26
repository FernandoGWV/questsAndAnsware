
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { init } from "next/dist/compiled/webpack/webpack";

interface Prop {
  question: string;
  answer: string;
}

class AI {
  constructor() {
  }
  AIResponse = async () => {
    try {

      const prompt =
        "Gere um array JSON contendo exatamente 4 objetos no seguinte formato: " +
        "[{id: number, title: string, options: string[]}] " +
        "Cada 'title' deve ser uma pergunta interligada com as outras e as 'options' devem conter quatro alternativas relacionadas. " +
        "IMPORTANTE: Responda apenas com o JSON puro, sem formatação extra, sem ```json e sem texto antes ou depois.";

      const response = await fetch('/api/ai', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response) {
        throw new Error('Ocorreu um erro na api')
      }

      const result = await response.json();
      const initQuests = result.result
      return initQuests;
    } catch (error) {
      console.error("Erro ao chamar API:", error);
      return null;
    }
  };
  AIResponseFromData = async (prompt: Prop[]) => {
    const response = await fetch('/api/ai', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response) {
      throw new Error('Ocorreu um erro na api')
    }

    const result = await response.json();
    return result.result;
  };
}

export default AI;
