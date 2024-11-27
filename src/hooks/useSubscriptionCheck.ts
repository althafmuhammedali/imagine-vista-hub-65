import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const useSubscriptionCheck = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  const checkSubscription = () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to generate images.",
        variant: "destructive",
      });
      navigate("/sign-in");
      return false;
    }

    const hasSubscription = user.publicMetadata.hasActiveSubscription;
    if (!hasSubscription) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to generate images.",
        variant: "destructive",
      });
      navigate("/pricing");
      return false;
    }

    return true;
  };

  return { checkSubscription, isSignedIn, user };
};