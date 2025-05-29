import { Description } from "@/components/Description";
import { ExampleQuestions } from "@/components/ExampleQuestions";
import { ChatBoxV2 } from "@/components/ChatBoxV2";

interface InitialScreenProps {
  onQuestionClick: (message: string) => void;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isChatOwner: boolean;
}

export const InitialScreen: React.FC<InitialScreenProps> = ({
  onQuestionClick,
  onSendMessage,
  isLoading,
  isChatOwner,
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground py-6 flex flex-col justify-between sm:py-12">
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto w-full">
        <div className="relative px-4 py-10 sm:p-12">
          <Description />
          <div className="my-4">
            <ExampleQuestions onQuestionClick={onQuestionClick} />
          </div>
          <ChatBoxV2 />
        </div>
      </div>
    </div>
  );
};
