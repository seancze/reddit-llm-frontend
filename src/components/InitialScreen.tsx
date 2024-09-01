import { Description } from "@/components/Description";
import { ExampleQuestions } from "@/components/ExampleQuestions";
import { ChatBox } from "@/components/ChatBox";

interface InitialScreenProps {
  onQuestionClick: (message: string) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const InitialScreen: React.FC<InitialScreenProps> = ({
  onQuestionClick,
  inputValue,
  onInputChange,
  onSendMessage,
  isLoading,
}) => {
  return (
    <div className="min-h-screen bg-gray-900 py-6 flex flex-col justify-between sm:py-12">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-gray-800 shadow-lg sm:rounded-3xl sm:p-12">
          <div className="max-w-3xl mx-auto">
            <Description />
            <ExampleQuestions onQuestionClick={onQuestionClick} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <ChatBox
            value={inputValue}
            onChange={onInputChange}
            onSend={onSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
