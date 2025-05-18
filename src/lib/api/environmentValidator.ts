
/**
 * Validates that all required environment variables are present
 * and provides helpful error messages when they're missing
 */
export function validateEnvironment() {
  const requiredVars = [
    {
      name: 'VITE_HUGGINGFACE_API_KEY',
      value: import.meta.env.VITE_HUGGINGFACE_API_KEY,
      message: 'Hugging Face API key is required for image generation'
    },
    {
      name: 'VITE_API_URL',
      value: import.meta.env.VITE_API_URL,
      message: 'API URL is required for connecting to the backend services'
    }
  ];

  const missingVars = requiredVars.filter(v => !v.value);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:');
    missingVars.forEach(v => {
      console.error(`- ${v.name}: ${v.message}`);
    });
    
    return {
      isValid: false,
      missingVars: missingVars.map(v => v.name),
      errorMessage: `Missing required configuration: ${missingVars.map(v => v.name).join(', ')}`
    };
  }
  
  return {
    isValid: true,
    missingVars: [],
    errorMessage: ''
  };
}
