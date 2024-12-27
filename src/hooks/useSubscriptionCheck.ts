import { useUser } from "@clerk/clerk-react";
import { parseISO } from "date-fns";

interface PublicUserData {
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
}

export function useSubscriptionCheck() {
  const { user } = useUser();
  
  const checkSubscription = () => {
    if (!user) return false;

    const publicMetadata = user.publicMetadata as PublicUserData;
    
    if (
      publicMetadata.subscriptionStatus === "active" &&
      publicMetadata.subscriptionEndDate
    ) {
      const endDate = parseISO(publicMetadata.subscriptionEndDate);
      return endDate > new Date();
    }

    return false;
  };

  return {
    isSubscribed: checkSubscription(),
  };
}