import React, { useState, useEffect } from "react";

interface FeedbackButtonsProps {
  queryId: string;
  onVoteClick: (vote: -1 | 0 | 1) => void;
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  queryId,
  onVoteClick,
}) => {
  const [currentVote, setCurrentVote] = useState<-1 | 0 | 1>(0);

  const handleVote = (vote: -1 | 1) => {
    const newVote = currentVote === vote ? 0 : vote;
    setCurrentVote(newVote);
    onVoteClick(newVote);
  };

  useEffect(() => {
    // reset the vote when queryId changes
    setCurrentVote(0);
  }, [queryId]);

  return (
    <div className="mt-8">
      <p className="text-lg font-semibold mb-4 ">Was this answer helpful?</p>
      <div className="flex space-x-4">
        <button
          className={`flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-200 ease-in-out shadow-md
            ${
              currentVote === 1
                ? "bg-green-500 text-white transform scale-105"
                : "hover:bg-green-500 hover:text-white bg-white text-green-500 hover:scale-105"
            }`}
          onClick={() => handleVote(1)}
        >
          👍 Yes
        </button>

        <button
          className={`flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-200 ease-in-out shadow-md
            ${
              currentVote === -1
                ? "bg-red-500 text-white transform scale-105"
                : "hover:bg-red-500 hover:text-white bg-white text-red-500 hover:scale-105"
            }`}
          onClick={() => handleVote(-1)}
        >
          👎 No
        </button>
      </div>
    </div>
  );
};
