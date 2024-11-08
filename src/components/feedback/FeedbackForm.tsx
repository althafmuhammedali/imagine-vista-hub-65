import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback before submitting",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the feedback to your backend
    toast({
      title: "Thank you!",
      description: "Your feedback has been submitted successfully.",
    });
    setFeedback("");
  };

  return (
    <div className="w-full max-w-md p-4 bg-black/40 rounded-lg border border-amber-900/20">
      <h3 className="text-amber-400 font-semibold mb-4">Share Your Feedback</h3>
      <Textarea 
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 rounded bg-black/20 border border-amber-900/20 text-white placeholder-amber-700/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[100px]"
        placeholder="We'd love to hear your thoughts..."
      />
      <Button 
        className="mt-2 bg-amber-500 hover:bg-amber-600 text-black font-medium w-full"
        onClick={handleSubmit}
      >
        Submit Feedback
      </Button>
    </div>
  );
}