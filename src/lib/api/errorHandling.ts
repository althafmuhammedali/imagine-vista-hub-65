import { toast } from "@/components/ui/use-toast";

export function handleApiError(error: unknown): Error {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      toast({
        title: "Request timeout",
        description: "The request took too long. Please try again with a simpler prompt.",
        variant: "destructive",
      });
      return new Error('Request timed out - please try again with a simpler prompt');
    }

    if (error.message === "model_busy") {
      toast({
        title: "Model Busy",
        description: "Model too busy, unable to get response in less than 60 second(s)",
        variant: "destructive",
      });
      return new Error("Model too busy, unable to get response in less than 60 second(s)");
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
    description: "An unexpected error occurred",
    variant: "destructive",
  });
  return new Error('Failed to generate image');
}