interface ExampleQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export const ExampleQuestions = ({
  onQuestionClick,
}: ExampleQuestionsProps) => {
  const questions = [
    "What is 2+2?",
    "Should I get solar panels for my home?",
    "How hot is the sun?",
    "What is the meaning of life?",
  ];

  return (
    <div className="grid grid-cols-2 gap-2 mb-8">
      {questions.map((q, index) => (
        <button
          key={index}
          className="bg-gray-200 hover:bg-gray-300 rounded-lg p-2 text-sm text-left"
          onClick={() => onQuestionClick(q)}
        >
          {q}
        </button>
      ))}
    </div>
  );
};
