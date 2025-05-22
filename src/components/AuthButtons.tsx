import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
export function AuthButtons() {
  const {
    isSignedIn
  } = useAuth();
  if (isSignedIn) {
    return <div className="fixed top-4 right-4">
        <UserButton afterSignOutUrl="/" appearance={{
        elements: {
          rootBox: "shadow-xl",
          card: "bg-black/20 backdrop-blur-sm border-gray-800",
          userPreviewMainIdentifier: "text-amber-400",
          userPreviewSecondaryIdentifier: "text-gray-400"
        }
      }} />
      </div>;
  }
  return <div className="fixed top-4 right-4 flex gap-2">
      
      
    </div>;
}