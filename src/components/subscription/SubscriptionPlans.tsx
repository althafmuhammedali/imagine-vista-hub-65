import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Gem, Star, Zap, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  imagesPerDay: number;
  icon: React.ReactNode;
  color: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["1 image generation per day", "Basic support", "Standard quality"],
    imagesPerDay: 1,
    icon: <Star className="w-6 h-6 text-amber-400" />,
    color: "bg-gradient-to-br from-gray-900 to-gray-800"
  },
  {
    id: "basic",
    name: "Basic Plan",
    price: 499,
    features: ["25 images per day", "Email support", "HD quality", "Priority queue"],
    imagesPerDay: 25,
    icon: <Gem className="w-6 h-6 text-blue-400" />,
    color: "bg-gradient-to-br from-blue-900 to-blue-800"
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 899,
    features: ["100 images per day", "Priority support", "4K quality", "Advanced settings", "Custom styles"],
    imagesPerDay: 100,
    icon: <Crown className="w-6 h-6 text-purple-400" />,
    color: "bg-gradient-to-br from-purple-900 to-purple-800"
  },
  {
    id: "unlimited",
    name: "Unlimited Premium",
    price: 1999,
    features: ["Unlimited generations", "24/7 support", "8K quality", "All features", "API access", "Custom training"],
    imagesPerDay: Infinity,
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    color: "bg-gradient-to-br from-amber-900 to-amber-800"
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
        <Card 
          key={plan.id} 
          className={`flex flex-col transform transition-all duration-300 hover:scale-105 ${plan.color} border-t-4 border-t-${plan.id === 'free' ? 'gray' : plan.id === 'basic' ? 'blue' : plan.id === 'premium' ? 'purple' : 'amber'}-400`}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              {plan.icon}
              <CardTitle className="text-white">{plan.name}</CardTitle>
            </div>
            <CardDescription className="text-gray-300">
              {plan.price === 0 ? (
                "Free forever"
              ) : (
                <>₹{plan.price}<span className="text-sm text-gray-400">/month</span></>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className={`w-full ${
                plan.id === "free" 
                  ? "bg-gray-700 hover:bg-gray-600" 
                  : plan.id === "basic"
                  ? "bg-blue-600 hover:bg-blue-500"
                  : plan.id === "premium"
                  ? "bg-purple-600 hover:bg-purple-500"
                  : "bg-amber-600 hover:bg-amber-500"
              } text-white transition-colors`}
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