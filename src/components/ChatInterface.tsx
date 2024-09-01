import React from "react";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { FeedbackButtons } from "@/components/FeedbackButtons";
import { Message } from "@/types/message";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession } from "next-auth/react";
import { ChatBox } from "@/components/ChatBox";

interface ChatInterfaceProps {
  queryId: string;
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
  onBackClick: () => void;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  currentVote: -1 | 0 | 1;
  setCurrentVote: React.Dispatch<React.SetStateAction<-1 | 0 | 1>>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  queryId,
  messages,
  inputValue,
  isLoading,
  onBackClick,
  onInputChange,
  onSendMessage,
  currentVote,
  setCurrentVote,
}) => {
  const { data: session } = useSession();

  const urlTransform = (href: string) => href;

  const components = {
    a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-500 hover:text-cyan-400 underline"
        {...props}
      />
    ),
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-grow overflow-auto pb-32">
        <div className="max-w-4xl mx-auto w-full px-4 py-6">
          <button
            onClick={onBackClick}
            className={`${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-cyan-600 hover:bg-cyan-700"
            } mb-4 p-2 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 shadow-md`}
            aria-label="Back to start"
            disabled={isLoading}
          >
            <FaArrowLeft className="w-6 h-6" />
          </button>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-md ${
                  message.type === "user"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-700 text-white border border-cyan-700"
                }`}
              >
                <>
                  <p className="font-medium mb-1">
                    {message.type === "user" ? "Question:" : "Response:"}
                  </p>
                  <ReactMarkdown
                    className="prose-invert max-w-none prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline"
                    remarkPlugins={[remarkGfm]}
                    urlTransform={urlTransform}
                    components={components}
                  >
                    {message.content}
                  </ReactMarkdown>
                </>
              </div>
            ))}
          </div>
          {isLoading && (
            <div className="flex justify-center items-center my-4">
              <FaSpinner className="animate-spin text-cyan-500 text-4xl" />
            </div>
          )}
          {!isLoading && session && messages.length === 2 && (
            <FeedbackButtons
              queryId={queryId}
              currentVote={currentVote}
              setCurrentVote={setCurrentVote}
            />
          )}
        </div>
      </div>
      <ChatBox
        value={inputValue}
        onChange={onInputChange}
        onSend={onSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
