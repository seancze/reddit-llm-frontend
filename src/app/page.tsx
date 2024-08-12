"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "@/types/message";
import { PLACEHOLDER_RESPONSE } from "@/utils/constants";
import { InitialScreen } from "@/components/InitialScreen";
import { ChatInterface } from "@/components/ChatInterface";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showInitialContent, setShowInitialContent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      setShowInitialContent(false);
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (process.env.NODE_ENV === "development") {
      setMessages([
        { type: "user", content: message },
        {
          type: "bot",
          content: PLACEHOLDER_RESPONSE,
        },
      ]);
    } else {
      setIsLoading(true);
      setIsWaitingForResponse(true);
      setMessages((prev) => [...prev, { type: "user", content: message }]);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = response.body;
      if (!data) {
        setIsLoading(false);
        setIsWaitingForResponse(false);
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let botMessage = "";

      setMessages((prev) => [...prev, { type: "bot", content: "" }]);
      setIsWaitingForResponse(false);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        botMessage += chunkValue;
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { type: "bot", content: botMessage },
        ]);
      }
    }

    setIsLoading(false);
  }, []);

  const handleBackClick = () => {
    setShowInitialContent(true);
    setMessages([]);
    setInputValue("");
  };

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
          messages={messages}
          inputValue={inputValue}
          isLoading={isLoading}
          isWaitingForResponse={isWaitingForResponse}
          onBackClick={handleBackClick}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
}
