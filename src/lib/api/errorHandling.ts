import { toast } from "@/components/ui/use-toast";

export function handleApiError(error: unknown): Error {
  console.error("API Error:", error); // Add logging for debugging

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      toast({
        title: "Request timeout",
        description: "The request took too long. Please try again with a simpler prompt.",
        variant: "destructive",
      });
      return new Error('Request timed out - please try again with a simpler prompt');
    }

    if (error.message.includes("model_busy") || error.message.includes("currently busy")) {
      toast({
        title: "Model Busy",
        description: "The AI model is currently busy. Please try again in a few moments.",
        variant: "destructive",
      });
      return new Error("Model is busy, please try again in a few moments");
    }

    if (error.message.includes("loading")) {
      toast({
        title: "Model Loading",
        description: "The AI model is warming up. Please try again in a few moments.",
        variant: "destructive",
      });
      return new Error("Model is loading, please try again in a few moments");
    }

    if (error.message.includes("rate limit") || error.message.includes("429")) {
      const waitTime = error.message.match(/\d+/)?.[0] || "30";
      toast({
        title: "Rate Limited",
        description: `Please wait ${waitTime} seconds before trying again.`,
        variant: "destructive",
      });
      return error;
    }

    if (error.message.includes("dimensions")) {
      toast({
        title: "Invalid Dimensions",
        description: error.message,
        variant: "destructive",
      });
      return error;
    }

    if (error.message.includes("authorization") || error.message.includes("401")) {
      toast({
        title: "Authentication Error",
        description: "Please check your API key configuration.",
        variant: "destructive",
      });
      return new Error("Authentication failed - please check your API key");
    }

    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return error;
  }

  toast({
    title: "Error",
    description: "An unexpected error occurred. Please try again.",
    variant: "destructive",
  });
  return new Error('Failed to generate image');
}