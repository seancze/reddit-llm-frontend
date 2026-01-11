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

  const entries = Object.entries(questionsDict);
  // Repeats the list to ensure the total width exceeds the screen width.
  // This is required by Embla Carousel to enable seamless infinite looping.
  // 7 items * ~176px = ~1232px. 4x covers ~4900px (supports up to 5k screens).
  const repeatedEntries = Array(4).fill(entries).flat();

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
        <MarqueeContent pauseOnHover={true} loop={true} speed={1}>
          {repeatedEntries.map(([key, question], index) => {
            return (
              <MarqueeItem
                key={`${key}-${index}`}
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
