"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "@/types/message";
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
    setIsLoading(true);
    setIsWaitingForResponse(true);
    setMessages((_) => [{ type: "user", content: message }]);
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

      // parse the JSON chunk and extract the "response" value
      try {
        const parsedChunk = JSON.parse(chunkValue);
        botMessage += parsedChunk.response || "";
      } catch (error) {
        // if parsing fails, add the chunk as is (this might happen for partial chunks)
        botMessage += chunkValue;
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { type: "bot", content: botMessage },
      ]);
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
