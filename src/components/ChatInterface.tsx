"use client";
import React, { useEffect } from "react";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { FeedbackButtons } from "@/components/FeedbackButtons";
import { Message } from "@/types/message";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession } from "next-auth/react";
import { ChatBox } from "@/components/ChatBox";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { toastConfig } from "@/app/utils/constants";
import { LinkPreview } from "@/components/LinkPreview";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ui/shadcn-io/ai/reasoning";

interface ChatInterfaceProps {
  queryId: string;
  chatId: string;
  messages: Message[];
  isLoading: boolean;
  isStreaming?: boolean;
  onBackClick: () => void;
  onSendMessage: (message: string) => void;
  currentVote: -1 | 0 | 1;
  setCurrentVote: React.Dispatch<React.SetStateAction<-1 | 0 | 1>>;
  isChatOwner: boolean;
  // Reasoning props
  showReasoning?: boolean;
  reasoningContent?: string;
  currentIteration?: number;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  queryId,
  chatId,
  messages,
  isLoading,
  isStreaming = false,
  onBackClick,
  onSendMessage,
  currentVote,
  setCurrentVote,
  isChatOwner,
  showReasoning = false,
  reasoningContent = "",
  currentIteration,
}) => {
  const { data: session } = useSession();

  // override what is shown when a link is found in markdown
  const components = {
    a: ({
      href,
      children,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      if (href) {
        return (
          <LinkPreview
            href={href}
            className="dark:text-cyan-500 dark:hover:text-cyan-400 text-[#1b76cf] hover:text-[#135391] underline"
          >
            {children}
          </LinkPreview>
        );
      }
      return <a {...props}>{children}</a>;
    },
  };

  const formatMessageContent = (content: string) =>
    content.replace(/\*\*Similar posts\*\*/g, "\\\n**Similar posts**");

  // used to show a warning when the user is not logged in and viewing a cached reply
  // this is set in the ExampleQuestions component when the user clicks on a question
  // and is redirected to the chat page without logging in
  useEffect(() => {
    const cachedReplyWarning = sessionStorage.getItem("cachedReplyWarning");
    console.log({ cachedReplyWarning });
    if (!cachedReplyWarning) return;

    if (!session) {
      console.log("[INFO] Showing cached reply warning");
      toast.warn(cachedReplyWarning, toastConfig);
    }
    sessionStorage.removeItem("cachedReplyWarning");
  }, [session]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4">
      <div className="grow overflow-y-auto pb-4">
        <div className="w-full py-6 px-2">
          <Button
            onClick={onBackClick}
            className="mb-4 rounded-full text-secondary-foreground"
            aria-label="Back to start"
            disabled={isLoading || isStreaming}
            size="icon"
          >
            <FaArrowLeft />
          </Button>

          <div className="space-y-4">
            {messages.map((message, i) => (
              <React.Fragment key={i}>
                <div
                  className={`p-4 rounded-lg shadow-md ${
                    message.role === "user"
                      ? "bg-primary"
                      : "border text-secondary-foreground bg-secondary"
                  }`}
                >
                  <Markdown
                    className="prose-invert max-w-none prose-a:no-underline hover:prose-a:underline overflow-auto"
                    remarkPlugins={[remarkGfm]}
                    components={components}
                  >
                    {formatMessageContent(message.content)}
                  </Markdown>
                </div>

                {/* Show reasoning after the last user message */}
                {message.role === "user" &&
                  i === messages.findLastIndex((m) => m.role === "user") &&
                  showReasoning &&
                  reasoningContent && (
                    <div className="my-4">
                      <Reasoning
                        isLoading={isLoading}
                        currentIteration={currentIteration}
                      >
                        <ReasoningTrigger title="Thinking" />
                        <ReasoningContent>{reasoningContent}</ReasoningContent>
                      </Reasoning>
                    </div>
                  )}
              </React.Fragment>
            ))}
          </div>

          {isLoading && (
            <div className="flex justify-center items-center my-4">
              <FaSpinner className="animate-spin text-4xl" />
            </div>
          )}
          {/* only show feedback button when response from AI is generated; this happens when messages.length is even */}
          {!isLoading &&
            !isStreaming &&
            session &&
            messages.length % 2 === 0 && (
              <FeedbackButtons
                queryId={queryId}
                chatId={chatId}
                currentVote={currentVote}
                setCurrentVote={setCurrentVote}
              />
            )}
        </div>
      </div>

      <ChatBox
        onSend={onSendMessage}
        isLoading={isLoading}
        isStreaming={isStreaming}
        isChatOwner={isChatOwner}
      />
    </div>
  );
};
