import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Plan } from "./types";

interface PlanCardProps {
  plan: Plan;
  onSubscribe: (plan: Plan) => void;
  loading: boolean;
}

export function PlanCard({ plan, onSubscribe, loading }: PlanCardProps) {
  return (
    <Card 
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
          onClick={() => onSubscribe(plan)}
          disabled={loading}
        >
          {loading ? (
            "Processing..."
          ) : plan.id === "free" ? (
            "Start Free"
          ) : (
            "Subscribe"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}