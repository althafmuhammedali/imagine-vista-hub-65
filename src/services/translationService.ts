import { toast } from "@/components/ui/use-toast";

export const translateToEnglish = async (text: string, sourceLang: string): Promise<string> => {
  if (sourceLang === 'en' || !text.trim()) return text;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-${sourceLang}-en`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const result = await response.json();
    return result[0].translation_text;
  } catch (error) {
    console.error('Translation error:', error);
    toast({
      title: "Translation Error",
      description: "Failed to translate prompt. Proceeding with original text.",
      variant: "destructive",
    });
    return text;
  }
};