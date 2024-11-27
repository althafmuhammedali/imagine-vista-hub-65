import { Star, Gem, Crown, Zap } from 'lucide-react';
import { Plan } from './types';

export const plans: Plan[] = [
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