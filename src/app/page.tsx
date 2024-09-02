"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "@/types/message";
import { InitialScreen } from "@/components/InitialScreen";
import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { questionsDict } from "@/app/utils/constants";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showInitialContent, setShowInitialContent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [queryId, setQueryId] = useState("");
  const [currentVote, setCurrentVote] = useState<-1 | 0 | 1>(0);
  const { data: session } = useSession();

  console.log({ session });

  useEffect(() => {
    if (messages.length > 0) {
      setShowInitialContent(false);
    }
  }, [messages]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      setIsLoading(true);
      setMessages((_) => [{ type: "user", content: message }]);

      try {
        let data;
        let response;
        const messageLower = message.toLowerCase();
        if (questionsDict[messageLower]) {
          response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}query/${questionsDict[messageLower]}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${session?.jwt}`,
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}query`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session?.jwt}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: message,
                username: session?.user?.name,
              }),
            }
          );
        }
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        data = await response.json();
        if (!data || !data.response) {
          throw new Error("Invalid response from server");
        }

        setMessages((prev) => [
          ...prev,
          { type: "bot", content: data.response },
        ]);
        setQueryId(data.query_id);
        setCurrentVote(data.user_vote);
      } catch (error) {
        console.log({ errorFetchingResponse: error });
        toast.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            progress: undefined,
          }
        );
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  const handleBackClick = () => {
    setShowInitialContent(true);
    setMessages([]);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow overflow-hidden">
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
            currentVote={currentVote}
            setCurrentVote={setCurrentVote}
          />
        )}
      </main>
      <ToastContainer theme="dark" />
    </div>
  );
}
