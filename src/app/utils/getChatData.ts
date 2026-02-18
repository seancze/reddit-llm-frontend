import { ChatData } from "@/types/chatData";
import { capitaliseFirstLetter } from "@/app/utils/format";
import { auth } from "@/auth";
import { questionsDict } from "@/app/utils/constants";

export const getChatData = async (pageId: string): Promise<ChatData> => {
  const session = await auth();
  const isInQuestionsDict = pageId in questionsDict;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}chats/${pageId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.jwt}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: isInQuestionsDict ? false : 86400 }, // Cache forever if in questionsDict, otherwise 24 hours
    }
  );
  const data = await res.json();
  if (!res.ok) {
    if (data.detail) {
      throw new Error(data.detail);
    } else {
      throw new Error(res.statusText);
    }
  }
  if (!data?.response) throw new Error("Invalid response from server");
  for (const msg of data.response) {
    if (msg.role === "user") {
      msg.content = capitaliseFirstLetter(msg.content);
    }
  }
  return {
    messages: data.response,
    vote: data.user_vote,
    lastQueryId: data.query_id,
    chatId: data.chat_id,
    isChatOwner: data.is_chat_owner,
  };
};
