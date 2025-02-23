/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { init } from "next/dist/compiled/webpack/webpack";

interface Prop {
  question: string;
  answer: string;
}

class AI {
  private genAI: GoogleGenerativeAI;
  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_AI_KEY;

    if (!apiKey) {
      throw new Error(
        "API key não encontrada! Verifique suas variáveis de ambiente."
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }
  AIResponse = async () => {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:
        "3. Responda apenas com base nos dados fornecidos.\n" +
        "4. Você receberá uma lista no seguinte formato: " +
        '[{"question": "A pergunta", "answer": "A resposta escolhida"}].\n' +
        "   - Cada item da lista contém uma pergunta e a resposta selecionada pelo usuário.\n" +
        "   - Sua resposta deve ser baseada estritamente nas respostas fornecidas, sem adicionar informações externas.\n" +
        "   - Se houver múltiplas perguntas e respostas, leve em consideração todas elas ao formular sua resposta.\n" +
        "   - Mantenha suas respostas objetivas e coerentes com as escolhas feitas pelo usuário.\n",
    });

    const prompt =
      "Gere um array JSON contendo exatamente 4 objetos no seguinte formato: " +
      "[{id: number, title: string, options: string[]}] " +
      "Cada 'title' deve ser uma pergunta interligada com as outras e as 'options' devem conter quatro alternativas relacionadas. " +
      "IMPORTANTE: Responda apenas com o JSON puro, sem formatação extra, sem ```json e sem texto antes ou depois.";

    const initQuests = (await model.generateContent(prompt)).response.text();

    return initQuests;
  };

  AIResponseFromData = async (data: Prop[]) => {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:
        "3. Responda apenas com base nos dados fornecidos.\n" +
        "4. Você receberá uma lista no seguinte formato: " +
        '[{"id": "Identificação de cada pergunta","question": "A pergunta", "answer": "A resposta escolhida"}].\n' +
        "   - Cada item da lista contém uma pergunta e a resposta selecionada pelo usuário.\n" +
        "   - Sua resposta deve ser baseada estritamente nas respostas fornecidas, sem adicionar informações externas.\n" +
        "   - Se houver múltiplas perguntas e respostas, leve em consideração todas elas ao formular sua resposta.\n" +
        "   - Evite utilizar o termo 'usuário' e sim 'você'.\n" +
        "   - A resposta deve descrever como a pessoa é com base nas perguntas e respostas fornecidas.\n" +
        "   - Faça respostas mais elaboradas e criativas.\n" +
        "   - Mantenha suas respostas objetivas e coerentes com as escolhas feitas pelo usuário.\n",
    });

    const response = (
      await model.generateContent(JSON.stringify(data))
    ).response.text();

    return response;
  };
}

export default AI;
