import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface ChatBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
}: ChatBoxProps) => {
  const { data: session } = useSession();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim() && !isLoading && session) {
      onChange("");
      await onSend(value);
    }
  };

  const isDisabled = !session;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className={`w-full px-4 py-3 pr-12  border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            ${
              isDisabled
                ? "cursor-not-allowed bg-gray-200"
                : "text-gray-700 bg-white"
            }`}
          placeholder={
            !session
              ? "Login to ask your own question"
              : "Type your question here..."
          }
          disabled={isDisabled}
        />
        <button
          type="submit"
          className={`absolute right-2 p-2 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400
            ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          disabled={isDisabled}
        >
          <FaPaperPlane className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
