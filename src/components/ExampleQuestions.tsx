import React from "react";
import { questionsDict } from "@/app/utils/constants";
import { capitaliseFirstLetter } from "@/app/utils/format";

interface ExampleQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({
  onQuestionClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
      {Object.entries(questionsDict).map(([key, question]) => {
        return (
          <button
            key={key}
            className="bg-gray-700 hover:bg-gray-600 rounded-lg p-2 text-xs md:text-sm text-left text-white border border-gray-600 hover:border-gray-400 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => onQuestionClick(question)}
          >
            {question}
          </button>
        );
      })}
    </div>
  );
};
