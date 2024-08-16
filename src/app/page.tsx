"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Message } from "@/types/message";
import { InitialScreen } from "@/components/InitialScreen";
import { ChatInterface } from "@/components/ChatInterface";
import { debounce } from "lodash";

type DebouncedFunction = {
  (queryId: string, vote: -1 | 0 | 1): void;
  cancel: () => void;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showInitialContent, setShowInitialContent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [queryId, setQueryId] = useState("");

  useEffect(() => {
    if (messages.length > 0) {
      setShowInitialContent(false);
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setMessages((_) => [{ type: "user", content: message }]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: message }),
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      if (!data || !data.response) {
        throw new Error("Invalid response from server");
      }

      setMessages((prev) => [...prev, { type: "bot", content: data.response }]);
      setQueryId(data.query_id);
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBackClick = () => {
    setShowInitialContent(true);
    setMessages([]);
    setInputValue("");
  };

  const debouncedVoteRef = useRef<DebouncedFunction | null>(null);

  useEffect(() => {
    debouncedVoteRef.current = debounce(
      async (queryId: string, vote: -1 | 0 | 1) => {
        try {
          console.log({ queryId, vote });
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}vote`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ query_id: queryId, vote }),
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

  const handleVoteClick = useCallback(
    (vote: -1 | 0 | 1) => {
      if (queryId && debouncedVoteRef.current) {
        debouncedVoteRef.current(queryId, vote);
      }
    },
    [queryId] // this ensures that the debounced function is recreated when queryId changes
  );
  return (
    <>
      {showInitialContent ? (
        <InitialScreen
          onQuestionClick={handleSendMessage}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      ) : (
        <ChatInterface
          queryId={queryId}
          messages={messages}
          inputValue={inputValue}
          isLoading={isLoading}
          onBackClick={handleBackClick}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          onVoteClick={handleVoteClick}
        />
      )}
    </>
  );
}
