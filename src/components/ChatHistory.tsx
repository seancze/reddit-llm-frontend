import ReactMarkdown from "react-markdown";
import { Message } from "@/types/message";

interface ChatHistoryProps {
  messages: Message[];
}

export const ChatHistory = ({ messages }: ChatHistoryProps) => {
  return (
    <div className="mb-4 max-h-[60vh] overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${
            message.type === "user" ? "bg-gray-100" : "bg-white"
          } p-4 rounded-lg`}
        >
          <h2 className="font-bold mb-2">
            {message.type === "user" ? "Question" : "Response"}
          </h2>
          <ReactMarkdown className="prose max-w-none">
            {message.content}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
};
