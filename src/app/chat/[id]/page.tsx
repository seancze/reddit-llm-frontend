import { ChatData } from "@/types/chatData";
import { capitaliseFirstLetter } from "@/app/utils/format";
import { Home } from "@/components/Home";
import { auth } from "@/auth";
import { questionsDict } from "@/app/utils/constants";

const getChatData = async (pageId: string): Promise<ChatData> => {
  const session = await auth();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}chat/${pageId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.jwt}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 86400 }, // 24 hours
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

export const generateStaticParams = (): { id: string }[] => {
  return Object.keys(questionsDict).map((id) => ({ id }));
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const chatData = await getChatData(params.id);
    return <Home initialChatData={chatData} />;
  } catch (error: any) {
    return (
      <Home initialError={error.message || "An unexpected error occurred"} />
    );
  }
}
