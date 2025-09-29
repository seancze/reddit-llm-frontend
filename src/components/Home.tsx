"use client";

import { useState, useEffect, useRef } from "react";
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
  preloadedChatData,
}: {
  initialChatData?: ChatData;
  initialError?: string;
  preloadedChatData?: Record<string, ChatData>;
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
    resetChatState,
    handleBackClick,
  } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const [chatData, setChatData] = useState<ChatData | undefined>(
    initialChatData
  );
  const { data: session } = useSession();
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  console.log({ session });

  useEffect(() => {
    return () => {
      // abort any ongoing fetch request when component unmounts (eg: navigating to different page)
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    // If a chat ID is selected, and we have preloaded data for it, use that instead
    if (chatId && preloadedChatData?.[chatId]) {
      setChatData(preloadedChatData[chatId]);
    } else {
      setChatData(initialChatData);
    }
  }, [chatId, preloadedChatData, initialChatData]);

  useEffect(() => {
    if (chatData) {
      setMessages(chatData.messages);
      setQueryId(chatData.lastQueryId);
      setChatId(chatData.chatId);
      setIsChatOwner(chatData.isChatOwner);
      setCurrentVote(chatData.vote);
    } else {
      // reset state to default values
      resetChatState();
    }
  }, [
    chatData,
    setMessages,
    setQueryId,
    setChatId,
    setIsChatOwner,
    setCurrentVote,
    resetChatState,
  ]);

  useEffect(() => {
    if (initialError) {
      toast.error(initialError, toastConfig);
    }
  }, [initialError]);

  const handleSendMessage = async (message: string) => {
    // abort any prior fetch
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    const messageWithQuestion: Message[] = [
      ...messages,
      { role: "user", content: message },
    ];
    setMessages(messageWithQuestion);

    try {
      const resp = await fetch(
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
          // pass the abort signal (if any) to the fetch request
          signal: controller.signal,
        }
      );

      if (!resp.ok) {
        throw new Error(resp.statusText);
      }

      const data = await resp.json();
      if (!data?.response) {
        throw new Error("Invalid response from server");
      }

      const lastIndex = data.response.length - 1;
      const isFirstMessage = messages.length === 0;
      if (isFirstMessage) {
        const timeNowUtcSeconds = Math.floor(Date.now() / 1000);
        // inserts the new chat at the top of our chat list
        setChats((prevChats) => [
          {
            chat_id: data.chat_id,
            // set to lowercase for consistency with results returned by the backend
            query: message.toLowerCase(),
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
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Request was cancelled");
        return;
      }
      let msg = err.message ?? "An unexpected error occurred";
      if (msg === "Unauthorized") {
        msg = session
          ? "Your session has expired. Please login again"
          : "Unauthorised: Please login to continue";
      }
      toast.error(msg, toastConfig);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <SidebarInset>
      <div className="flex flex-col bg-background text-foreground max-h-screen">
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
