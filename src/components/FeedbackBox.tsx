import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { MessageSquare } from "lucide-react";

export function FeedbackBox() {
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/send-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback: feedback,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Thank you for your feedback!",
        });
        setFeedback("");
      } else {
        throw new Error("Failed to send feedback");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="p-4 backdrop-blur-sm bg-black/10 border-gray-800">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <MessageSquare className="w-4 h-4" />
          <h3 className="text-sm font-medium">Send us your feedback</h3>
        </div>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts, suggestions, or report issues..."
          className="min-h-[100px] bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white"
        />
        <Button
          type="submit"
          disabled={isSending}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
        >
          {isSending ? "Sending..." : "Send Feedback"}
        </Button>
      </form>
    </Card>
  );
}