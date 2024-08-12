import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { ChatBox } from "@/components/ChatBox";
import { FeedbackButtons } from "@/components/FeedbackButtons";
import { Message } from "@/types/message";

interface ChatInterfaceProps {
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
  isWaitingForResponse: boolean;
  onBackClick: () => void;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputValue,
  isLoading,
  isWaitingForResponse,
  onBackClick,
  onInputChange,
  onSendMessage,
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-grow overflow-auto">
        <div className="relative max-w-4xl mx-auto w-full px-4 py-6">
          <button
            onClick={onBackClick}
            className="mb-4 p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 shadow-md"
            aria-label="Back to start"
          >
            <FaArrowLeft className="w-6 h-6" />
          </button>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-md ${
                  message.type === "user"
                    ? "bg-cyan-50 text-cyan-900"
                    : "bg-white text-gray-800 border border-cyan-200"
                }`}
              >
                <p className="font-medium mb-1">
                  {message.type === "user" ? "Question:" : "Response:"}
                </p>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
          {isWaitingForResponse && (
            <div className="flex justify-center items-center my-4">
              <FaSpinner className="animate-spin text-cyan-500 text-4xl" />
            </div>
          )}
          {messages.length > 0 && <FeedbackButtons />}
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <ChatBox
            value={inputValue}
            onChange={onInputChange}
            onSend={onSendMessage}
            isLoading={isLoading}
          />
        </div>
      </footer>
    </div>
  );
};