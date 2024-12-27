import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Card } from "../ui/card";

interface PublicUserData {
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
  // ... add other public metadata fields as needed
}

export function SubscriptionPlans() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to subscribe",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Type assertion to include publicMetadata
      await user?.update({
        publicMetadata: {
          subscriptionStatus: "active",
          subscriptionEndDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        } as PublicUserData,
      });

      toast({
        title: "Success",
        description: "Your subscription has been activated",
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to activate subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Subscription Plans</h2>
      <Card>
        <p>Choose a plan that suits you best!</p>
        <Button onClick={handleSubscribe} disabled={isLoading}>
          {isLoading ? "Loading..." : "Subscribe Now"}
        </Button>
      </Card>
    </div>
  );
}
