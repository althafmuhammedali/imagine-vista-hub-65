import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export function ChatMessage({ message, isBot }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
      <Avatar className="w-8 h-8">
        <AvatarImage src={isBot ? "/bot-avatar.png" : undefined} />
        <AvatarFallback>{isBot ? "AI" : "You"}</AvatarFallback>
      </Avatar>
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] ${
          isBot
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {message}
      </div>
    </div>
  );
}