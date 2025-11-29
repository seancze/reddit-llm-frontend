"use client";

import { useState, useEffect } from "react";
import { Message } from "@/types/message";
import { InitialScreen } from "@/components/InitialScreen";
import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { toastConfig } from "@/app/utils/constants";
import { useChatContext } from "@/contexts/ChatContext";
import { ChatData } from "@/types/chatData";
import { SidebarInset } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useStreamingQuery } from "@/hooks/useStreamingQuery";

export const Home = ({
  initialChatData,
  initialError,
  preloadedChatData,
}: {
  initialChatData?: ChatData;
  initialError?: string;
  preloadedChatData?: Record<string, ChatData>;
}) => {
  const {
    messages,
    setMessages,
    queryId,
    setQueryId,
    chatId,
    setChatId,
    isChatOwner,
    setIsChatOwner,
    setChats,
    currentVote,
    setCurrentVote,
    resetChatState,
    handleBackClick,
  } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const [chatData, setChatData] = useState<ChatData | undefined>(
    initialChatData
  );
  const { data: session } = useSession();

  // Streaming state
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  const [thinkingStatus, setThinkingStatus] = useState<{
    iteration: number;
    tool: string;
    collection?: string;
    pipeline?: any[];
    args?: any;
  } | null>(null);
  const [thinkingHistory, setThinkingHistory] = useState<
    Array<{
      iteration: number;
      tool: string;
      collection?: string;
      pipeline?: any[];
      args?: any;
    }>
  >([]);

  const { streamQuery, cancelStream, isStreaming } = useStreamingQuery({
    onStreamStart: () => {
      console.log("[Streaming] Stream started - hiding loading indicator");
      setIsLoading(false);
    },
    onRoute: (route) => {
      console.log(`[Streaming] Route selected: ${route}`);
      setCurrentRoute(route);
    },
    onThinking: (thinking) => {
      console.log("[Streaming] Thinking:", thinking);
      setThinkingStatus(thinking);
      // Add to history if not already present
      setThinkingHistory((prev) => {
        const exists = prev.some(
          (t) => t.iteration === thinking.iteration && t.tool === thinking.tool
        );
        return exists ? prev : [...prev, thinking];
      });
    },
    onChunk: (chunk) => {
      // Clear thinking status when actual content starts
      setThinkingStatus(null);
      // Update the streaming message as chunks arrive
      setStreamingMessage((prev) => prev + chunk);
    },
    onComplete: (metadata) => {
      console.log("[Streaming] Complete:", metadata);
    },
    onError: (error) => {
      console.error("[Streaming] Error:", error);
    },
  });

  useEffect(() => {
    return () => {
      // Cancel any ongoing stream when component unmounts
      cancelStream();
    };
  }, [cancelStream]);

  useEffect(() => {
    // If a chat ID is selected, and we have preloaded data for it, use that instead
    if (chatId && preloadedChatData?.[chatId]) {
      setChatData(preloadedChatData[chatId]);
    } else {
      setChatData(initialChatData);
    }
  }, [chatId, preloadedChatData, initialChatData]);

  useEffect(() => {
    if (chatData) {
      setMessages(chatData.messages);
      setQueryId(chatData.lastQueryId);
      setChatId(chatData.chatId);
      setIsChatOwner(chatData.isChatOwner);
      setCurrentVote(chatData.vote);
    } else {
      // reset state to default values
      resetChatState();
    }
  }, [
    chatData,
    setMessages,
    setQueryId,
    setChatId,
    setIsChatOwner,
    setCurrentVote,
    resetChatState,
  ]);

  useEffect(() => {
    if (initialError) {
      toast.error(initialError, toastConfig);
    }
  }, [initialError]);

  // Format thinking steps as markdown string for the Reasoning component
  const formatThinkingContent = () => {
    let content = "";

    // Add route selection
    if (currentRoute) {
      content += `**Route Selection**\n\n`;
      content += `Using ${
        currentRoute === "nosql" ? "Database Search" : "Vector Search"
      }\n\n`;
      content += `---\n\n`;
    }

    // Add thinking steps
    thinkingHistory.forEach((step, index) => {
      const isActive =
        thinkingStatus?.iteration === step.iteration &&
        thinkingStatus?.tool === step.tool;

      content += `**${step.iteration}. ${step.tool}**${
        isActive ? " ⚡" : ""
      }\n\n`;

      if (step.collection) {
        content += `*Collection:* \`${step.collection}\`\n\n`;
      }

      if (step.pipeline && step.pipeline.length > 0) {
        content += `*Pipeline:*\n\n`;
        content += `\`\`\`json\n`;
        content += JSON.stringify(step.pipeline, null, 2);
        content += `\n\`\`\`\n\n`;
      }
    });

    return content || "Processing...";
  };

  const handleSendMessage = async (message: string) => {
    if (!session?.jwt) {
      toast.error("Please login to continue", toastConfig);
      return;
    }

    setIsLoading(true);
    setStreamingMessage(""); // Reset streaming message
    setCurrentRoute(null);
    setThinkingStatus(null);
    setThinkingHistory([]);

    const messageWithQuestion: Message[] = [
      ...messages,
      { role: "user", content: message },
    ];
    setMessages(messageWithQuestion);

    try {
      const result = await streamQuery(
        messageWithQuestion,
        session.jwt,
        chatId || undefined
      );

      const isFirstMessage = messages.length === 0;
      if (isFirstMessage) {
        const timeNowUtcSeconds = Math.floor(Date.now() / 1000);
        // inserts the new chat at the top of our chat list
        setChats((prevChats) => [
          {
            chat_id: result.chatId,
            // set to lowercase for consistency with results returned by the backend
            query: message.toLowerCase(),
            created_utc: timeNowUtcSeconds,
          },
          ...prevChats,
        ]);
      }

      // Add the complete response to messages
      setMessages([
        ...messageWithQuestion,
        { role: "assistant", content: result.response },
      ]);
      setQueryId(result.queryId);
      setChatId(result.chatId);
      setCurrentVote(result.userVote);
      setIsChatOwner(true);
      setStreamingMessage(""); // Clear streaming message after complete
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Request was cancelled");
        return;
      }
      let msg = err.message ?? "An unexpected error occurred";
      if (msg === "Unauthorized") {
        msg = session
          ? "Your session has expired. Please login again"
          : "Unauthorised: Please login to continue";
      }
      toast.error(msg, toastConfig);
      // Remove the user's message if there was an error
      setMessages(messages);
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  // Combine actual messages with the streaming message for display
  const displayMessages = [...messages];
  if (isStreaming && streamingMessage) {
    displayMessages.push({ role: "assistant", content: streamingMessage });
  }

  return (
    <SidebarInset>
      <div className="flex flex-col bg-background text-foreground max-h-screen">
        <Header onBackClick={handleBackClick} />

        <main className="grow overflow-hidden">
          {messages.length === 0 && !isStreaming ? (
            <InitialScreen
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              isChatOwner={isChatOwner}
            />
          ) : (
            <ChatInterface
              queryId={queryId}
              chatId={chatId}
              messages={displayMessages}
              isLoading={isLoading}
              isStreaming={isStreaming}
              onBackClick={handleBackClick}
              onSendMessage={handleSendMessage}
              currentVote={currentVote}
              setCurrentVote={setCurrentVote}
              isChatOwner={isChatOwner}
              showReasoning={
                currentRoute !== null || thinkingHistory.length > 0
              }
              reasoningContent={formatThinkingContent()}
              currentIteration={thinkingStatus?.iteration}
            />
          )}
        </main>
      </div>
    </SidebarInset>
  );
};
