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
    <div className="mt-4">
      <p className="mb-2">Was this answer useful?</p>
      <div className="flex space-x-4">
        <button
          className={`rounded-full p-2 ${
            currentVote === 1
              ? "bg-green-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleVote(1)}
        >
          😊 Yes
        </button>

        <button
          className={`rounded-full p-2 ${
            currentVote === -1
              ? "bg-red-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleVote(-1)}
        >
          😞 No
        </button>
      </div>
    </div>
  );
};
