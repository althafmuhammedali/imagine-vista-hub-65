import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export function ChatMessage({ message, isBot }: ChatMessageProps) {
  return (
    <div className={`flex gap-2 sm:gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
      <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
        <AvatarImage src={isBot ? "/bot-avatar.png" : undefined} />
        <AvatarFallback className="text-xs sm:text-sm">{isBot ? "AI" : "You"}</AvatarFallback>
      </Avatar>
      <div
        className={`rounded-lg px-3 py-2 sm:px-4 sm:py-2 max-w-[75%] sm:max-w-[80%] text-sm sm:text-base ${
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