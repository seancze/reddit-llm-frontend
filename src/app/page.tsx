import { Home } from "@/components/Home";
import { questionsDict } from "@/app/utils/constants";
import { getChatData } from "@/app/utils/getChatData";
import { ChatData } from "@/types/chatData";

const fetchPreloadedChatData = async (): Promise<Record<string, ChatData>> => {
  const chatDataMap = await Promise.all(
    Object.keys(questionsDict).map(async (id) => {
      const chatData = await getChatData(id);

      return [id, chatData];
    })
  );
  return Object.fromEntries(chatDataMap);
};

export default async function Page() {
  const preloadedChatData = await fetchPreloadedChatData();

  return <Home preloadedChatData={preloadedChatData} />;
}
