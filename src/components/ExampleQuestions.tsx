"use client";

import React from "react";
import { questionsDict } from "@/app/utils/constants";
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/kibo-ui/marquee";
import { useSession } from "next-auth/react";
import { useChatContext } from "@/contexts/ChatContext";

interface ExampleQuestionsProps {
  onSendMessage: (question: string, key?: string) => void;
}

export const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({
  onSendMessage,
}) => {
  const { data: session } = useSession();
  const { setChatId } = useChatContext();

  const onQuestionClick = (question: string, key: string) => {
    if (session) {
      onSendMessage(question);
    } else {
      sessionStorage.setItem(
        "cachedReplyWarning",
        "Hey, you are viewing a cached reply. Login to get a new reply!"
      );
      setChatId(key);
    }
  };
  return (
    <div className="flex size-full items-center justify-center bg-background">
      <Marquee>
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent pauseOnHover={false}>
          {Object.entries(questionsDict).map(([key, question]) => {
            return (
              <MarqueeItem
                key={key}
                className="h-24 w-40 text-xs hover:cursor-pointer border-0 rounded-lg flex items-center justify-center px-2 bg-primary hover:bg-primary/90"
                onClick={() => onQuestionClick(question, key)}
              >
                {question}
              </MarqueeItem>
            );
          })}
        </MarqueeContent>
      </Marquee>
    </div>
  );
};
