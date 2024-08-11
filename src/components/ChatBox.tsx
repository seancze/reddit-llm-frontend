import React from "react";
import { FaPaperPlane } from "react-icons/fa";

interface ChatBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  value,
  onChange,
  onSend,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim()) {
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
          className="absolute right-2 p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <FaPaperPlane className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
