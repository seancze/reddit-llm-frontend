import React from "react";
import { questionsDict } from "@/app/utils/constants";
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/kibo-ui/marquee";

interface ExampleQuestionsProps {
  onQuestionClick: (question: string, key?: string) => void;
}

export const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({
  onQuestionClick,
}) => {
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
                className="h-24 w-40 text-xs hover:cursor-pointer border-0 rounded-lg flex items-center justify-center px-2 text-primary-foreground bg-primary hover:bg-primary/90"
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
