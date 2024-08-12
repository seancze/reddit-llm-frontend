import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value);
      onChange("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className="w-full px-4 py-3 pr-12 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Type your question here..."
        />
        <button
          type="submit"
          className={`absolute right-2 p-2 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            isLoading ? "bg-gray-400" : " bg-cyan-500 hover:bg-cyan-600 "
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner className="w-5 h-5 animate-spin" />
          ) : (
            <FaPaperPlane className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};
