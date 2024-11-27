import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  imagesPerDay: number;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["1 image generation per day", "Basic support", "Standard quality"],
    imagesPerDay: 1
  },
  {
    id: "basic",
    name: "Basic Plan",
    price: 499,
    features: ["25 images per day", "Email support", "HD quality", "Priority queue"],
    imagesPerDay: 25
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 899,
    features: ["100 images per day", "Priority support", "4K quality", "Advanced settings", "Custom styles"],
    imagesPerDay: 100
  },
  {
    id: "unlimited",
    name: "Unlimited Premium",
    price: 1999,
    features: ["Unlimited generations", "24/7 support", "8K quality", "All features", "API access", "Custom training"],
    imagesPerDay: Infinity
  }
];

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
      // Here you would integrate with your payment provider
      // For now, we'll just show a toast
      toast({
        title: "Coming Soon",
        description: "Subscription functionality will be available soon!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => (
        <Card key={plan.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>
              {plan.price === 0 ? (
                "Free forever"
              ) : (
                <>₹{plan.price}<span className="text-sm text-muted-foreground">/month</span></>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={plan.id === "free" ? "outline" : "default"}
              onClick={() => handleSubscribe(plan)}
              disabled={loading === plan.id}
            >
              {loading === plan.id ? (
                "Processing..."
              ) : plan.id === "free" ? (
                "Start Free"
              ) : (
                "Subscribe"
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}