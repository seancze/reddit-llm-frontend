interface ExampleQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export const ExampleQuestions = ({
  onQuestionClick,
}: ExampleQuestionsProps) => {
  const questions = [
    "What are the key challenges that youths face?",
    "Categorise all posts and provide a % breakdown in descending order.",
    "What are the top 3 most popular posts?",
    "What do JC students rant about?",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
      {questions.map((q, index) => (
        <button
          key={index}
          className="bg-gray-200 hover:bg-gray-300 rounded-lg p-2 text-xs md:text-sm text-left"
          onClick={() => onQuestionClick(q)}
        >
          {q}
        </button>
      ))}
    </div>
  );
};
