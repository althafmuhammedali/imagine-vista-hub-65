export async function translateToEnglish(text: string, sourceLanguage: string): Promise<string> {
  if (sourceLanguage === "en") return text;
  
  try {
    // For now, return the original text as a fallback
    // In a production environment, you would integrate with a translation API
    console.log(`Translation requested for text: ${text} from language: ${sourceLanguage}`);
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text as fallback
    return text;
  }
}