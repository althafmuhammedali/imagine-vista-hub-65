import { toast } from "@/components/ui/use-toast";

export async function translateToEnglish(text: string, sourceLanguage: string): Promise<string> {
  if (sourceLanguage === "en") return text;
  
  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text,
        source_lang: sourceLanguage.toUpperCase(),
        target_lang: "EN",
      }),
    });

    if (!response.ok) {
      console.error("Translation failed:", await response.text());
      return text; // Fallback to original text
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error("Translation error:", error);
    toast({
      title: "Translation failed",
      description: "Using original text for image generation",
      variant: "destructive",
    });
    return text; // Fallback to original text
  }
}