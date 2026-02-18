"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Message } from "@/types/message";
import { useRouter, usePathname } from "next/navigation";
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
  resetChatState: () => void;
  handleBackClick: () => void;
  shareChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  setStreamCanceller: React.Dispatch<React.SetStateAction<(() => void) | null>>;
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
  const [streamCanceller, setStreamCanceller] = useState<(() => void) | null>(
    null
  );
  const { data: session } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  // useCallback ensures that the function is not recreated on every render of the ChatProvider component
  // if it was recreated on every render, it would trigger an infinite loop in the useEffect hook in Home.tsx
  const resetChatState = useCallback(() => {
    setMessages([]);
    setQueryId("");
    setChatId("");
    setIsChatOwner(true);
    setCurrentVote(0);
  }, []);

  const handleBackClick = () => {
    // Cancel any ongoing streaming request
    if (streamCanceller) {
      streamCanceller();
    }

    if (pathname === "/") {
      // if the user is already on the home page, explicitly reset the chat state
      // used when user clicks back from a cached chat (i.e. one of the example questions) or a new chat
      resetChatState();
    } else {
      // otherwise, rely on the home page to reset chat state
      // used when user clicks back from an existing chat
      router.push("/");
    }
  };

  const shareChat = async (chatIdToShare: string) => {
    const shareUrl = `${process.env.NEXT_PUBLIC_URL}chat/${chatIdToShare}`;
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}chats/${chatIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
            "Content-Type": "application/json",
          },
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
        resetChatState,
        handleBackClick,
        shareChat,
        deleteChat,
        setStreamCanceller,
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
