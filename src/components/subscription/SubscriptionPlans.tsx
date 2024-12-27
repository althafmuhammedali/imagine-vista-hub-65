import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Card } from "../ui/card";

interface PublicUserData {
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
}

export function SubscriptionPlans() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      toast("Please sign in", {
        description: "You need to be signed in to subscribe"
      });
      return;
    }

    setIsLoading(true);
    try {
      await user?.update({
        // @ts-ignore - Clerk types are incomplete for publicMetadata
        publicMetadata: {
          subscriptionStatus: "active",
          subscriptionEndDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      });

      toast("Success", {
        description: "Your subscription has been activated"
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast("Error", {
        description: "Failed to activate subscription"
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