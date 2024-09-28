"use client";

import { useState, useEffect } from "react";
import { Message } from "@/types/message";
import { InitialScreen } from "@/components/InitialScreen";
import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "@/app/utils/constants";
import { ChatData } from "@/types/chatData";
import { FaSpinner } from "react-icons/fa";

export const Home = ({
  chatData,
  initialError,
  isGettingChat,
}: {
  initialQueryId?: string;
  chatData?: ChatData;
  initialError?: string;
  isGettingChat?: boolean;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queryId, setQueryId] = useState("");
  const [chatId, setChatId] = useState("");
  const [isChatOwner, setIsChatOwner] = useState(true);
  const [currentVote, setCurrentVote] = useState<-1 | 0 | 1>(0);
  const { data: session } = useSession();

  console.log({ session });

  useEffect(() => {
    if (initialError) {
      toast.error(initialError, toastConfig);
    }
  }, [initialError]);

  useEffect(() => {
    if (chatData) {
      setMessages(chatData.messages);
      setQueryId(chatData.lastQueryId);
      setChatId(chatData.chatId);
      setIsChatOwner(chatData.isChatOwner);
      setCurrentVote(chatData.vote);
    }
  }, [chatData]);

  // TODO: refactor this function
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
      // if the user is not logged in, the user should only be able to get cached results
      if (!session) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}chat/${message}`,
          {
            method: "GET",
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
      setIsChatOwner(true);
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
    setMessages([]);
    setQueryId("");
    setChatId("");
    setIsChatOwner(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow overflow-hidden">
        {isGettingChat ? (
          <div className="flex justify-center items-center my-4">
            <FaSpinner className="animate-spin text-cyan-500 text-4xl" />
          </div>
        ) : messages.length === 0 ? (
          <InitialScreen
            onQuestionClick={handleSendMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isChatOwner={isChatOwner}
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
            isChatOwner={isChatOwner}
          />
        )}
      </main>
      <ToastContainer theme="dark" />
    </div>
  );
};
export default Home;
