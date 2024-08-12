"use client";

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { Logo } from "@/components/Logo";
import { Description } from "@/components/Description";
import { ExampleQuestions } from "@/components/ExampleQuestions";
import { ChatBox } from "@/components/ChatBox";
import { ChatHistory } from "@/components/ChatHistory";
import { Message } from "@/types/message";
import { FeedbackButtons } from "@/components/FeedbackButtons";
import { PLACEHOLDER_RESPONSE } from "@/utils/constants";

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
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-between sm:py-12">
      <Head>
        <title>LLM AI for Reddit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-3 sm:max-w-3xl sm:mx-auto w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-3xl mx-auto">
            {!showInitialContent && (
              <button
                onClick={handleBackClick}
                className="mb-6 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Back to start"
              >
                <FaArrowLeft className="w-6 h-6" />
              </button>
            )}
            {showInitialContent && (
              <>
                <Logo />
                <Description />
                <ExampleQuestions onQuestionClick={handleSendMessage} />
              </>
            )}
            <ChatHistory messages={messages} />
            {isWaitingForResponse && (
              <div className="flex justify-center items-center my-4">
                <FaSpinner className="animate-spin text-blue-500 text-4xl" />
              </div>
            )}
            {messages.length > 0 && <FeedbackButtons />}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <ChatBox
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
