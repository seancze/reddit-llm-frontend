"use client";

import { useState, useEffect } from "react";
import { Message } from "@/types/message";
import { InitialScreen } from "@/components/InitialScreen";
import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { toastConfig } from "@/app/utils/constants";
import { useChatContext } from "@/contexts/ChatContext";
import { ChatData } from "@/types/chatData";
import { SidebarInset } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

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
    setChats,
    currentVote,
    setCurrentVote,
    handleBackClick,
  } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  console.log({ session });

  useEffect(() => {
    if (initialChatData) {
      setMessages(initialChatData.messages);
      setQueryId(initialChatData.lastQueryId);
      setChatId(initialChatData.chatId);
      setIsChatOwner(initialChatData.isChatOwner);
      setCurrentVote(initialChatData.vote);
    } else {
      // reset state to default values
      setMessages([]);
      setQueryId("");
      setChatId("");
      setIsChatOwner(true);
      setCurrentVote(0);
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

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    const messageWithQuestion: Message[] = [
      ...messages,
      { role: "user", content: message },
    ];
    setMessages(messageWithQuestion);

    try {
      const response = await fetch(
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

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      console.log({ data });
      if (!data || !data.response) {
        throw new Error("Invalid response from server");
      }

      const lastIndex = data.response.length - 1;

      const isFirstMessage = messages.length === 0;
      if (isFirstMessage) {
        router.push(`/chat/${data.chat_id}`);
        const timeNowUtcSeconds = Math.floor(Date.now() / 1000);
        // inserts the new chat at the top of our chat list
        setChats((prevChats) => [
          {
            chat_id: data.chat_id,
            query: message,
            created_utc: timeNowUtcSeconds,
          },
          ...prevChats,
        ]);
      }

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

  return (
    <SidebarInset>
      <div className="flex flex-col bg-background text-foreground">
        <Header onBackClick={handleBackClick} />
        <main className="grow overflow-hidden">
          {messages.length === 0 ? (
            <InitialScreen
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
      </div>
    </SidebarInset>
  );
};
