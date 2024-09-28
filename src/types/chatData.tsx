import { Message } from "@/types/message";

export type ChatData = {
  messages: Message[];
  vote: 0 | 1 | -1;
  lastQueryId: string;
  chatId: string;
  isChatOwner: boolean;
};
