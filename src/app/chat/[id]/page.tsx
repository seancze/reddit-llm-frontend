import { ChatData } from "@/types/chatData";
import { capitaliseFirstLetter } from "@/app/utils/format";
import { Home } from "@/components/Home";
import { auth } from "@/auth";

const getChatData = async (pageId: string): Promise<ChatData> => {
  const session = await auth();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}chat/${pageId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.jwt}`,
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

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const chatData = await getChatData(params.id);

    return <Home initialChatData={chatData} />;
  } catch (error: any) {
    return (
      <Home initialError={error.message || "An unexpected error occurred"} />
    );
  }
}
