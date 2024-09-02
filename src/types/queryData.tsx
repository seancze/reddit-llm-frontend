import { Message } from "@/types/message";

export type QueryData = {
  messages: Message[];
  vote: 0 | 1 | -1;
};
