import { useState, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  selectedLanguage: string;
}

// Extended language support with 40 languages
export const languageCodes = {
  en: 'en-US',    // English (US)
  es: 'es-ES',    // Spanish
  fr: 'fr-FR',    // French
  de: 'de-DE',    // German
  it: 'it-IT',    // Italian
  pt: 'pt-PT',    // Portuguese
  nl: 'nl-NL',    // Dutch
  pl: 'pl-PL',    // Polish
  ru: 'ru-RU',    // Russian
  ja: 'ja-JP',    // Japanese
  ko: 'ko-KR',    // Korean
  zh: 'zh-CN',    // Chinese (Simplified)
  ar: 'ar-SA',    // Arabic
  hi: 'hi-IN',    // Hindi
  bn: 'bn-IN',    // Bengali
  mal: 'ml-IN',   // Malayalam
  ta: 'ta-IN',    // Tamil
  te: 'te-IN',    // Telugu
  kn: 'kn-IN',    // Kannada
  mr: 'mr-IN',    // Marathi
  gu: 'gu-IN',    // Gujarati
  ur: 'ur-PK',    // Urdu
  fa: 'fa-IR',    // Persian
  th: 'th-TH',    // Thai
  vi: 'vi-VN',    // Vietnamese
  id: 'id-ID',    // Indonesian
  ms: 'ms-MY',    // Malay
  fil: 'fil-PH',  // Filipino
  tr: 'tr-TR',    // Turkish
  el: 'el-GR',    // Greek
  he: 'he-IL',    // Hebrew
  sv: 'sv-SE',    // Swedish
  da: 'da-DK',    // Danish
  no: 'nb-NO',    // Norwegian
  fi: 'fi-FI',    // Finnish
  hu: 'hu-HU',    // Hungarian
  cs: 'cs-CZ',    // Czech
  sk: 'sk-SK',    // Slovak
  ro: 'ro-RO',    // Romanian
  bg: 'bg-BG',    // Bulgarian
  uk: 'uk-UA',    // Ukrainian
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
