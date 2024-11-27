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
      // Create order
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          userId: user?.id,
          amount: plan.price * 100, // Convert to smallest currency unit
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create subscription');
      }

      const data = await response.json();

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: 'ComicForge AI',
        description: `${plan.name} Subscription`,
        image: 'https://i.ibb.co/3SptMK9/Gemini-Generated-Image-gym6grgym6grgym6.jpg',
        prefill: {
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
        },
        theme: {
          color: '#F59E0B',
        },
        handler: async function(response: any) {
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

            if (!verifyResponse.ok) {
              const error = await verifyResponse.json();
              throw new Error(error.message || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            
            // Update user metadata to reflect active subscription
            await user?.update({
              unsafeMetadata: {
                hasActiveSubscription: true,
                subscriptionPlan: plan.id,
                subscriptionEndDate: verifyData.subscriptionEndDate,
              },
            });

            toast({
              title: "Success",
              description: "Your subscription has been activated successfully!",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: error instanceof Error ? error.message : "Failed to verify payment",
              variant: "destructive",
            });
          }
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