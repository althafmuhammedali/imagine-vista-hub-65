import { useState, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  selectedLanguage: string;
}

const languageCodes = {
  en: 'en-US',
  mal: 'ml-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ur: 'ur-PK'
};

export function VoiceInput({ onTranscript, selectedLanguage }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Error",
        description: "Voice recognition is not supported in your browser. Please use Chrome.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = languageCodes[selectedLanguage as keyof typeof languageCodes] || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening",
        description: "Speak now...",
      });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      toast({
        title: "Success",
        description: "Voice captured successfully!",
      });
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      toast({
        title: "Error",
        description: "Failed to capture voice. Please try again.",
        variant: "destructive",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onTranscript, selectedLanguage]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={startListening}
      disabled={isListening}
      className="relative h-9 w-9"
    >
      {isListening ? (
        <MicOff className="h-4 w-4 text-destructive animate-pulse" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}