import { Description } from "@/components/Description";
import { ExampleQuestions } from "@/components/ExampleQuestions";
import { ChatBox } from "@/components/ChatBox";

interface InitialScreenProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isChatOwner: boolean;
}

export const InitialScreen: React.FC<InitialScreenProps> = ({
  onSendMessage,
  isLoading,
  isChatOwner,
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground py-6 flex flex-col justify-center sm:justify-between sm:py-12">
      <div className="relative py-3 max-w-4xl sm:max-w-3/4 mx-auto w-full px-4 mb-60">
        <div className="relative py-10 sm:p-12">
          <Description />
        </div>

        {/* only flush components to bottom on small screens */}
        <div className="fixed bottom-0 left-0 right-0 max-w-4xl sm:max-w-3/4 mx-auto px-4 sm:relative">
          <div className="my-4">
            <ExampleQuestions onSendMessage={onSendMessage} />
          </div>
          <ChatBox
            onSend={onSendMessage}
            isLoading={isLoading}
            isChatOwner={isChatOwner}
          />
        </div>
      </div>
    </div>
  );
};
