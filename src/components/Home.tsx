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
import { useChatContext } from "@/contexts/ChatContext";
import { ChatData } from "@/types/chatData";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export const Home = ({
  initialChatData,
  initialError,
}: {
  initialChatData?: ChatData;
  initialError?: string;
}) => {
  const {
    messages,
    setMessages,
    queryId,
    setQueryId,
    chatId,
    setChatId,
    isChatOwner,
    setIsChatOwner,
    currentVote,
    setCurrentVote,
  } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  console.log({ session });

  useEffect(() => {
    if (initialChatData) {
      setMessages(initialChatData.messages);
      setQueryId(initialChatData.lastQueryId);
      setChatId(initialChatData.chatId);
      setIsChatOwner(initialChatData.isChatOwner);
      setCurrentVote(initialChatData.vote);
    }
  }, [
    initialChatData,
    setMessages,
    setQueryId,
    setChatId,
    setIsChatOwner,
    setCurrentVote,
  ]);

  useEffect(() => {
    if (initialError) {
      toast.error(initialError, toastConfig);
    }
  }, [initialError]);

  // TODO: refactor this function
  const handleSendMessage = async (message: string, key?: string) => {
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
          `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}chat/${key}`,
          {
            method: "GET",
          }
        );
        toast.warn(
          "Hey, you are seeing a cached reply. Login to get a new reply!",
          toastConfig
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
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground-primary">
      <Header onBackClick={handleBackClick} />
      <main className="grow overflow-hidden">
        {messages.length === 0 ? (
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
      <ToastContainer theme={theme} />
    </div>
  );
};
