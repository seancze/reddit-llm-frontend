"use client";
import {
  AIInput,
  AIInputButton,
  AIInputModelSelect,
  AIInputModelSelectContent,
  AIInputModelSelectItem,
  AIInputModelSelectTrigger,
  AIInputModelSelectValue,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ui/kibo-ui/ai/input";
import { GlobeIcon, MicIcon, PlusIcon, SendIcon } from "lucide-react";
import { type FormEventHandler, useState } from "react";

export const ChatBoxV2 = () => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message");
    console.log("Submitted message:", message);
  };
  return (
    <AIInput onSubmit={handleSubmit}>
      <AIInputTextarea />
      <AIInputToolbar>
        <AIInputTools></AIInputTools>
        <AIInputSubmit>
          <SendIcon size={16} />
        </AIInputSubmit>
      </AIInputToolbar>
    </AIInput>
  );
};
