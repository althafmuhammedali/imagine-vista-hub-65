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
        description: "Please sign in to access this feature.",
        variant: "destructive",
      });
      navigate("/sign-in");
      return false;
    }

    const hasSubscription = user.unsafeMetadata.hasActiveSubscription as boolean;
    const subscriptionEndDate = user.unsafeMetadata.subscriptionEndDate as string | undefined;
    
    if (!hasSubscription || (subscriptionEndDate && new Date(subscriptionEndDate) < new Date())) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to access this feature.",
        variant: "destructive",
      });
      navigate("/pricing");
      return false;
    }

    return true;
  };

  return { checkSubscription, isSignedIn, user };
};