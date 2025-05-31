import React from "react";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { FeedbackButtons } from "@/components/FeedbackButtons";
import { Message } from "@/types/message";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession } from "next-auth/react";
import { ChatBox } from "@/components/ChatBox";
import { Button } from "@/components/ui/button";

interface ChatInterfaceProps {
  queryId: string;
  chatId: string;
  messages: Message[];
  isLoading: boolean;
  onBackClick: () => void;
  onSendMessage: (message: string) => void;
  currentVote: -1 | 0 | 1;
  setCurrentVote: React.Dispatch<React.SetStateAction<-1 | 0 | 1>>;
  isChatOwner: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  queryId,
  chatId,
  messages,
  isLoading,
  onBackClick,
  onSendMessage,
  currentVote,
  setCurrentVote,
  isChatOwner,
}) => {
  const { data: session } = useSession();

  const urlTransform = (href: string) => href;

  // used to customise style of hyperlinks in markdown
  const components = {
    a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="dark:text-cyan-500 dark:hover:text-cyan-400 text-[#1b76cf] hover:text-[#135391] underline"
        {...props}
      />
    ),
  };

  const formatMessageContent = (content: string) => {
    return content.replace(/\*\*Similar posts\*\*/g, "\\\n**Similar posts**");
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4">
      <div className="grow overflow-y-auto pb-4">
        {/* px-2 ensures that thumbs up button does not go out of bounds when hovered */}
        <div className="w-full py-6 px-2">
          <Button
            onClick={onBackClick}
            className={`mb-4 rounded-full text-primary-foreground bg-primary`}
            aria-label="Back to start"
            disabled={isLoading}
            size={"icon"}
          >
            <FaArrowLeft />
          </Button>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-md ${
                  message.role === "user"
                    ? "text-primary-foreground bg-primary"
                    : "border text-secondary-foreground bg-secondary"
                }`}
              >
                <>
                  <Markdown
                    className="prose-invert max-w-none prose-a:no-underline hover:prose-a:underline"
                    remarkPlugins={[remarkGfm]}
                    urlTransform={urlTransform}
                    components={components}
                  >
                    {formatMessageContent(message.content)}
                  </Markdown>
                </>
              </div>
            ))}
          </div>
          {isLoading && (
            <div className="flex justify-center items-center my-4">
              <FaSpinner className="animate-spin text-4xl" />
            </div>
          )}
          {/* only show feedback button when response from AI is generated; this happens when messages.length is even */}
          {!isLoading && session && messages.length % 2 == 0 && (
            <FeedbackButtons
              queryId={queryId}
              chatId={chatId}
              currentVote={currentVote}
              setCurrentVote={setCurrentVote}
            />
          )}
        </div>
      </div>
      <div>
        <ChatBox
          onSend={onSendMessage}
          isLoading={isLoading}
          isChatOwner={isChatOwner}
        />
      </div>
    </div>
  );
};
