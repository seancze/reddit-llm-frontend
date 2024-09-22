"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "@/types/message";
import { InitialScreen } from "@/components/InitialScreen";
import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { questionsDict, toastConfig } from "@/app/utils/constants";
import { QueryData } from "@/types/queryData";

export const Home = ({
  initialQueryId,
  queryData,
  initialError,
}: {
  initialQueryId?: string;
  queryData?: QueryData;
  initialError?: string;
}) => {
  const [messages, setMessages] = useState<Message[]>(
    queryData?.messages || []
  );
  const [showInitialContent, setShowInitialContent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [queryId, setQueryId] = useState(initialQueryId || "");
  const [chatId, setChatId] = useState("");
  const [currentVote, setCurrentVote] = useState<-1 | 0 | 1>(
    queryData?.vote || 0
  );
  const { data: session } = useSession();

  console.log({ session });

  useEffect(() => {
    if (messages.length > 0) {
      setShowInitialContent(false);
    }
  }, [messages]);

  useEffect(() => {
    if (initialError) {
      toast.error(initialError, toastConfig);
    }
  }, []);

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    const messageWithQuestion: Message[] = [
      ...messages,
      { role: "user", content: message },
    ];
    setMessages(messageWithQuestion);

    try {
      let data;
      let response;
      const messageLower = message.toLowerCase();
      if (questionsDict[messageLower]) {
        // TODO: change this to only trigger when example question is clicked; if a question is asked instead, should return a custom response
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
              query: messageWithQuestion,
              username: session?.user?.name,
              chat_id: chatId,
            }),
          }
        );
      }
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      data = await response.json();
      console.log({ data });
      if (!data || !data.response) {
        throw new Error("Invalid response from server");
      }

      const lastIndex = data.response.length - 1;

      setMessages([...messageWithQuestion, data.response[lastIndex]]);
      setQueryId(data.query_id);
      setChatId(data.chat_id);
      setCurrentVote(data.user_vote);
    } catch (error) {
      console.log({ errorFetchingResponse: error });
      let errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      if (errorMessage === "Unauthorized") {
        if (session) {
          errorMessage = "Your session has expired. Please login again";
        } else {
          errorMessage = "Unauthorised: Please login to continue";
        }
      }
      toast.error(errorMessage, toastConfig);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    setShowInitialContent(true);
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow overflow-hidden">
        {showInitialContent ? (
          <InitialScreen
            onQuestionClick={handleSendMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        ) : (
          <ChatInterface
            queryId={queryId}
            chatId={chatId}
            messages={messages}
            isLoading={isLoading}
            onBackClick={handleBackClick}
            onSendMessage={handleSendMessage}
            currentVote={currentVote}
            setCurrentVote={setCurrentVote}
          />
        )}
      </main>
      <ToastContainer theme="dark" />
    </div>
  );
};
export default Home;
