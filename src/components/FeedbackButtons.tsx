"use client";

import { useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";

interface FeedbackButtonsProps {
  queryId: string;
  currentVote: -1 | 0 | 1;
  setCurrentVote: React.Dispatch<React.SetStateAction<-1 | 0 | 1>>;
}

type DebouncedFunction = {
  (queryId: string, vote: -1 | 0 | 1, username: string): void;
  cancel: () => void;
};

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  queryId,
  currentVote,
  setCurrentVote,
}) => {
  const { data: session } = useSession();
  const debouncedVoteRef = useRef<DebouncedFunction | null>(null);

  console.log({ currentVote });

  const handleVote = useCallback(
    (vote: -1 | 1) => {
      const newVote = currentVote === vote ? 0 : vote;
      setCurrentVote(newVote);

      if (queryId && debouncedVoteRef.current && session?.user?.name) {
        debouncedVoteRef.current(queryId, newVote, session?.user?.name);
      }
    },
    // this ensures that the debounced function is recreated when any of the dependencies change
    [queryId, session?.user?.name, currentVote, setCurrentVote]
  );

  useEffect(() => {
    debouncedVoteRef.current = debounce(
      async (queryId: string, vote: -1 | 0 | 1, username: string) => {
        try {
          console.log({ queryId, vote });
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}vote`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ query_id: queryId, vote, username }),
            }
          );

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          console.log(`Vote of ${vote} submitted for query ${queryId}`);
        } catch (error) {
          console.error("Error submitting vote:", error);
        }
      },
      300
    );

    return () => {
      if (debouncedVoteRef.current) {
        debouncedVoteRef.current.cancel();
      }
    };
  }, []);

  return (
    <div className="mt-8">
      <p className="text-lg font-semibold mb-4 text-white">
        Was this answer helpful?
      </p>
      <div className="flex space-x-4">
        <button
          className={`flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-200 ease-in-out shadow-md
            ${
              currentVote === 1
                ? "bg-green-600 text-white transform scale-105"
                : "hover:bg-green-600 hover:text-white bg-gray-700 text-green-400 hover:scale-105"
            }`}
          onClick={() => handleVote(1)}
        >
          👍 Yes
        </button>

        <button
          className={`flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-200 ease-in-out shadow-md
            ${
              currentVote === -1
                ? "bg-red-600 text-white transform scale-105"
                : "hover:bg-red-600 hover:text-white bg-gray-700 text-red-400 hover:scale-105"
            }`}
          onClick={() => handleVote(-1)}
        >
          👎 No
        </button>
      </div>
    </div>
  );
};
