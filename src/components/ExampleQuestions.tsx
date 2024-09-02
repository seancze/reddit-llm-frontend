import React from "react";
import { questionsDict } from "@/app/utils/constants";

interface ExampleQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const capitalizeFirstLetter = (str: string): string => {
  return str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str;
};

export const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({
  onQuestionClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
      {Object.keys(questionsDict).map((question, index) => {
        const questionFormatted = capitalizeFirstLetter(question);
        return (
          <button
            key={index}
            className="bg-gray-700 hover:bg-gray-600 rounded-lg p-2 text-xs md:text-sm text-left text-white border border-gray-600 hover:border-gray-400 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => onQuestionClick(questionFormatted)}
          >
            {capitalizeFirstLetter(questionFormatted)}
          </button>
        );
      })}
    </div>
  );
};
