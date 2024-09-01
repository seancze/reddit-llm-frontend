import React from "react";

interface ExampleQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({
  onQuestionClick,
}) => {
  const questions = [
    "What are the key challenges that youths face?",
    "Group all posts by category in descending order and provide a % breakdown",
    "What are the top 3 most popular posts?",
    "What are some time management tips?",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
      {questions.map((q, index) => (
        <button
          key={index}
          className="bg-gray-700 hover:bg-gray-600 rounded-lg p-2 text-xs md:text-sm text-left text-white border border-gray-600 hover:border-gray-400 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={() => onQuestionClick(q)}
        >
          {q}
        </button>
      ))}
    </div>
  );
};
