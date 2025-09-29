import { Home } from "@/components/Home";
import { questionsDict } from "@/app/utils/constants";
import { getChatData } from "@/app/utils/getChatData";

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
