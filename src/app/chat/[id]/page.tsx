"use client";
import { useState, useEffect } from "react";
import { Home } from "@/app/page";
import { ChatData } from "@/types/chatData";
import { capitaliseFirstLetter } from "@/app/utils/format";
import { useSession } from "next-auth/react";

const getQueryData = async (
  pageId: string,
  jwt: string | undefined
): Promise<ChatData> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}chat/${pageId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Error: Query not found");
      } else {
        throw new Error(response.statusText);
      }
    }

    const data = await response.json();
    if (!data || !data.response) {
      throw new Error("Invalid response from server");
    }

    let messages = data.response;
    for (const message of messages) {
      if (message.role === "user") {
        message.content = capitaliseFirstLetter(message.content);
      }
    }

    return {
      messages: messages,
      vote: data.user_vote,
      lastQueryId: data.query_id,
      chatId: data.chat_id,
      isChatOwner: data.is_chat_owner,
    };
  } catch (error) {
    console.error("Error fetching query data:", error);
    throw error;
  }
};

export const Page = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();
  const [isGettingChat, setIsGettingChat] = useState(true);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        const queryData = await getQueryData(params.id, session?.jwt);
        setChatData(queryData);
      } catch (error: any) {
        console.log({ error });
        setError(error);
        setChatData(null);
      } finally {
        setIsGettingChat(false);
      }
    };

    loadChatData();
  }, [params.id, session?.jwt]);
  console.log({ chatData });

  return isGettingChat ? (
    <Home isGettingChat />
  ) : chatData ? (
    <Home chatData={chatData} />
  ) : (
    <Home
      initialError={
        error instanceof Error ? error.message : "An unexpected error occurred"
      }
    />
  );
};

export default Page;
