import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";

export function AuthButtons() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return (
      <div className="fixed top-4 right-4">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              rootBox: "shadow-xl",
              card: "bg-black/20 backdrop-blur-sm border-gray-800",
              userPreviewMainIdentifier: "text-amber-400",
              userPreviewSecondaryIdentifier: "text-gray-400",
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 flex gap-2">
      <SignInButton mode="modal">
        <Button variant="outline" className="border-gray-800 bg-black/20 hover:bg-amber-500/20 hover:border-amber-500 text-gray-300">
          Sign in
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
          Sign up
        </Button>
      </SignUpButton>
    </div>
  );
}