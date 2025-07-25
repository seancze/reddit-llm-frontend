"use client";

import { useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { FaShare, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useChatContext } from "@/contexts/ChatContext";

interface FeedbackButtonsProps {
  queryId: string;
  chatId: string;
  currentVote: -1 | 0 | 1;
  setCurrentVote: React.Dispatch<React.SetStateAction<-1 | 0 | 1>>;
}

type DebouncedFunction = {
  (queryId: string, vote: -1 | 0 | 1, username: string): void;
  cancel: () => void;
};

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  queryId,
  chatId,
  currentVote,
  setCurrentVote,
}) => {
  const { data: session } = useSession();
  const debouncedVoteRef = useRef<DebouncedFunction | null>(null);
  const { shareChat } = useChatContext();

  const handleVote = useCallback(
    (vote: -1 | 1) => {
      const newVote = currentVote === vote ? 0 : vote;
      setCurrentVote(newVote);

      if (queryId && debouncedVoteRef.current && session?.user?.name) {
        debouncedVoteRef.current(queryId, newVote, session?.user?.name);
      }
    },
    [queryId, session?.user?.name, currentVote, setCurrentVote]
  );

  useEffect(() => {
    debouncedVoteRef.current = debounce(
      async (queryId: string, vote: -1 | 0 | 1, username: string) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}vote`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${session?.jwt}`,
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
  }, [session?.jwt]);

  return (
    <div className="mt-8">
      <div className="flex space-x-4">
        <button
          className={`flex items-center justify-center px-4 py-3 rounded-full font-medium transition-all duration-200 ease-in-out shadow-md border
            ${
              currentVote === 1
                ? "bg-green-600 text-white transform scale-105"
                : "hover:bg-green-600 hover:text-white bg-secondary text-green-400 hover:scale-105"
            }`}
          onClick={() => handleVote(1)}
        >
          <FaThumbsUp />
        </button>

        <button
          className={`flex items-center justify-center px-4 py-3 rounded-full font-medium transition-all duration-200 ease-in-out shadow-md border
            ${
              currentVote === -1
                ? "bg-red-600 text-white transform scale-105"
                : "hover:bg-red-600 hover:text-white bg-secondary text-red-400 hover:scale-105"
            }`}
          onClick={() => handleVote(-1)}
        >
          <FaThumbsDown />
        </button>

        <div className="relative">
          <button
            onClick={() => shareChat(chatId)}
            className="flex items-center justify-center px-4 py-3 rounded-full font-medium transition-all duration-200 ease-in-out shadow-md border
              hover:bg-cyan-600 hover:text-white bg-secondary text-cyan-400 hover:scale-105"
          >
            <FaShare className="mr-2" /> Share
          </button>
        </div>
      </div>
    </div>
  );
};
