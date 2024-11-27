import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Heart, Send } from "lucide-react";

export function FeedbackForm() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://formbold.com/s/9XDVY", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: feedback }),
      });

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "Your feedback has been submitted successfully.",
        });
        setFeedback("");
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 sm:p-6 md:p-8 backdrop-blur-sm bg-black/10 border-gray-800 shadow-xl transition-all duration-500 hover:scale-[1.01] mx-auto max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%]">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400 mb-4 flex items-center gap-2 justify-center sm:justify-start">
        <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        Share Your Feedback
      </h2>
      <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 text-center sm:text-left">
        Help us improve ComicForge AI by sharing your thoughts and suggestions
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type your feedback here..."
          className="min-h-[150px] sm:min-h-[200px] bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white resize-none w-full rounded-lg text-sm sm:text-base p-3 sm:p-4"
          required
          aria-label="Feedback message"
        />
        <div className="flex justify-center sm:justify-start">
          <Button 
            type="submit"
            className="w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 transition-colors duration-300 text-base sm:text-lg rounded-lg font-medium shadow-lg hover:shadow-xl active:transform active:scale-95"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            Send Feedback
          </Button>
        </div>
      </form>
    </Card>
  );
}