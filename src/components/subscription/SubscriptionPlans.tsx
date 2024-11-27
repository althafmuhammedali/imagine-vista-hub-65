import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { plans } from "./plans-data";
import { PlanCard } from "./PlanCard";
import { Plan } from "./types";

export function SubscriptionPlans() {
  const { isSignedIn, user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: Plan) => {
    if (!isSignedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }

    setLoading(plan.id);
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          userId: user?.id,
          amount: plan.price * 100, // Convert to paise
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      const options = {
        key: 'rzp_live_5JYQnqKRnKhB5y',
        subscription_id: data.subscriptionId,
        name: 'ComicForge AI',
        description: `${plan.name} Subscription`,
        image: 'https://i.ibb.co/3SptMK9/Gemini-Generated-Image-gym6grgym6grgym6.jpg',
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?.id,
                planId: plan.id,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || 'Payment verification failed');
            }

            toast({
              title: "Success",
              description: "Subscription activated successfully!",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to verify payment. Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
        },
        theme: {
          color: '#F59E0B',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process subscription",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onSubscribe={handleSubscribe}
          loading={loading === plan.id}
        />
      ))}
    </div>
  );
}