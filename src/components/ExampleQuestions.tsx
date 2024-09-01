interface ExampleQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export const ExampleQuestions = ({
  onQuestionClick,
}: ExampleQuestionsProps) => {
  const questions = [
    "What are the key challenges that youths face?",
    "Categorise all posts in descending order. Provide a % breakdown.",
    "What are the top 3 most popular posts?",
    "What are some time management tips?",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
      {questions.map((q, index) => (
        <button
          key={index}
          className="bg-gray-700 hover:bg-gray-600 rounded-lg p-2 text-xs md:text-sm text-left text-white"
          onClick={() => onQuestionClick(q)}
        >
          {q}
        </button>
      ))}
    </div>
  );
};
