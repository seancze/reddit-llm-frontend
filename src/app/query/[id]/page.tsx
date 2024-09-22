import { Home } from "@/app/page";
import { QueryData } from "@/types/queryData";
import { capitaliseFirstLetter } from "@/app/utils/format";

const getQueryData = async (pageId: string): Promise<QueryData> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}query/${pageId}`,
      {
        method: "GET",
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

    return {
      messages: [
        { role: "user", content: capitaliseFirstLetter(data.query) },
        { role: "assistant", content: data.response },
      ],
      vote: data.user_vote,
    };
  } catch (error) {
    console.error("Error fetching query data:", error);
    throw error;
  }
};

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const queryData = await getQueryData(params.id);
    return <Home initialQueryId={params.id} queryData={queryData} />;
  } catch (error) {
    console.log({ error });
    return (
      <Home
        initialError={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        }
      />
    );
  }
}
