// contexts/ChatContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { Message } from "@/types/message";
import { useRouter } from "next/navigation";

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  queryId: string;
  setQueryId: React.Dispatch<React.SetStateAction<string>>;
  chatId: string;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
  isChatOwner: boolean;
  setIsChatOwner: React.Dispatch<React.SetStateAction<boolean>>;
  currentVote: -1 | 0 | 1;
  setCurrentVote: React.Dispatch<React.SetStateAction<-1 | 0 | 1>>;
  handleBackClick: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queryId, setQueryId] = useState("");
  const [chatId, setChatId] = useState("");
  const [isChatOwner, setIsChatOwner] = useState(true);
  const [currentVote, setCurrentVote] = useState<-1 | 0 | 1>(0);
  const router = useRouter();
  const handleBackClick = () => {
    setMessages([]);
    setQueryId("");
    setChatId("");
    setIsChatOwner(true);
    router.push("/");
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        isLoading,
        setIsLoading,
        queryId,
        setQueryId,
        chatId,
        setChatId,
        isChatOwner,
        setIsChatOwner,
        currentVote,
        setCurrentVote,
        handleBackClick,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
