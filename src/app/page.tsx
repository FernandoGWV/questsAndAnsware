/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight, RotateCcw } from "lucide-react";
import AI from "@/services/ai";
interface Question {
  id: number;
  title: string;
  options: string[];
}

interface Answare {
  question: string;
  answare: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Answare[]>([]);
  const [result, setResult] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { AIResponse, AIResponseFromData } = new AI();

  useEffect(() => {
    handleFunction();
    resetQuiz();
  }, []);

  const handleFunction = async () => {
    try {
      setIsLoading(true);
      const response = await AIResponse();
      const cleanedResponse = response.replace(/```json|```/g, "").trim();
      const jsonData = JSON.parse(cleanedResponse);
      setQuestions(jsonData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleSubmitWithData = async (answersData: any) => {
    try {
      setIsLoading(true);
      const result = await AIResponseFromData(answersData);
      setResult(result);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    const findedAnswer = answers.find(
      (item: any) => item.id === questions[currentStep].id
    );

    if (!findedAnswer) {
      const newAnswers = [
        ...answers,
        {
          id: questions[currentStep].id,
          question: questions[currentStep].title,
          answare: option,
        },
      ];

      setAnswers(newAnswers as []);

      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmitWithData(newAnswers);
      }
    } else {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult("");
    setQuestions([]);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {isLoading && (
          <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
            <svg
              className="text-gray-300 animate-spin"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
            >
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600"
              ></path>
            </svg>
            <h1 className="text-black text-xl">Aguarde...</h1>
          </div>
        )}
        {!isLoading && (
          <>
            {!result ? (
              <>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {questions[currentStep].title}
                    </h2>
                    <span className="w-[80px] text-sm font-medium text-gray-500">
                      {currentStep + 1} de {questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentStep + 1) / questions.length) * 100
                          }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grid gap-4">
                  {questions[currentStep].options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-purple-50 rounded-xl transition-colors duration-200 group"
                    >
                      <span className="text-gray-700 group-hover:text-purple-700">
                        {option}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Seu Resultado
                </h2>
                <p className="text-lg text-gray-600 mb-8">{result}</p>
                <button
                  onClick={() => {
                    resetQuiz();
                    handleFunction();
                  }}
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  <RotateCcw className="w-5 h-5" />
                  Recomeçar
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
