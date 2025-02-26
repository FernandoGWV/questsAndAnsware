import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

    const apiKey = process.env.GEMINI_AI_KEY;
    if (!apiKey) return NextResponse.json({ error: "API Key missing" }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:
        "1. Responda apenas com base nos dados fornecidos.\n" +
        "2. Você receberá uma lista no seguinte formato: " +
        '[{"id": "Identificação de cada pergunta","question": "A pergunta", "answer": "A resposta escolhida"}].\n' +
        "   - Cada item da lista contém uma pergunta e a resposta selecionada pelo usuário.\n" +
        "   - Sua resposta deve ser baseada estritamente nas respostas fornecidas, sem adicionar informações externas.\n" +
        "   - Se houver múltiplas perguntas e respostas, leve em consideração todas elas ao formular sua resposta.\n" +
        "   - Evite utilizar o termo 'usuário' e sim 'você'.\n" +
        "   - Importante: A resposta deve descrever como a pessoa é com base nas perguntas e respostas fornecidas.\n" +
        "   - Caso receba respostas a menos, deve sempre elabora uma resposta de acordo com que recebeu, não faça outras respostas sem ser sobre a pessoa.\n" +
        "   - Importante: Faça respostas mais elaboradas e criativas.\n" +
        "   - Importante: Mantenha suas respostas objetivas e coerentes com as escolhas feitas pelo usuário.\n",
    });
    if (prompt && Array.isArray(prompt)) {
      const formattedPrompt = prompt
        .map((item: any) => `Id:${item.id}\nQuestion: ${item.question}\nAnsware: ${item.answare}`)
        .join("\n\n");
      const response = await model.generateContent({ contents: [{ role: "user", parts: [{ text: formattedPrompt }] }] });
      return NextResponse.json({ result: response.response.text() });
    }

    const response = await model.generateContent(prompt);
    return NextResponse.json({ result: response.response.text() });
  } catch (error) {
    console.error("Erro no servidor:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}