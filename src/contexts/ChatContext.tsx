"use client";

import React, { createContext, useContext, useState } from "react";
import { Message } from "@/types/message";
import { useRouter } from "next/navigation";
import { ChatOverview } from "@/types/chatOverview";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { toastConfig } from "@/app/utils/constants";
import { revalidatePathForChat } from "@/app/chat/[id]/actions";

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  queryId: string;
  setQueryId: React.Dispatch<React.SetStateAction<string>>;
  chatId: string;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
  chats: ChatOverview[];
  setChats: React.Dispatch<React.SetStateAction<ChatOverview[]>>;
  isChatOwner: boolean;
  setIsChatOwner: React.Dispatch<React.SetStateAction<boolean>>;
  currentVote: -1 | 0 | 1;
  setCurrentVote: React.Dispatch<React.SetStateAction<-1 | 0 | 1>>;
  handleBackClick: () => void;
  shareChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
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
  const [chats, setChats] = useState<ChatOverview[]>([]);
  const { data: session } = useSession();

  const router = useRouter();
  const handleBackClick = () => {
    router.push("/");
  };

  const shareChat = async (chatIdToShare: string) => {
    const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}chat/${chatIdToShare}`;
    console.log({ shareUrl });
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Copied to clipboard!", toastConfig);
    } catch (err) {
      toast.error("Failed to copy", toastConfig);
    }
  };

  const deleteChat = async (chatIdToDelete: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}chat`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chat_id: chatIdToDelete }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }
      setChats((prevChats) =>
        prevChats.filter((chat) => chat.chat_id !== chatIdToDelete)
      );
      // revalidate the path to ensure that if the user navigates to it, they will no longer see the deleted chat
      await revalidatePathForChat(chatIdToDelete);
      if (chatId === chatIdToDelete) {
        handleBackClick();
      }
      toast.success("Chat deleted successfully", toastConfig);
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat", toastConfig);
    }
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
        chats,
        setChats,
        isChatOwner,
        setIsChatOwner,
        currentVote,
        setCurrentVote,
        handleBackClick,
        shareChat,
        deleteChat,
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
