import axios from 'axios';

export const translateToEnglish = async (text: string, sourceLanguage: string): Promise<string> => {
  if (sourceLanguage === 'en') return text;
  
  try {
    const response = await axios.post('https://translation-api.example.com/translate', {
      text,
      source: sourceLanguage,
      target: 'en'
    });
    
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text if translation fails
  }
};