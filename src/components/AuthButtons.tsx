import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { MobileNav } from "./MobileNav";
import { toast } from "./ui/use-toast";
import { Crown } from "lucide-react";

export function AuthButtons() {
  const { isSignedIn } = useAuth();

  const handleSignIn = () => {
    toast({
      title: "Sign In",
      description: "Opening sign in modal",
    });
  };

  const handleSignUp = () => {
    toast({
      title: "Sign Up",
      description: "Opening sign up modal",
    });
  };

  return (
    <div className="fixed top-safe-top right-safe-right z-50 p-4">
      <div className="lg:hidden">
        <MobileNav />
      </div>
      <div className="hidden lg:block">
        {isSignedIn ? (
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                rootBox: "shadow-lg royal-shadow",
                card: "bg-black/95 backdrop-blur-sm border-primary/50",
                userPreviewMainIdentifier: "text-primary",
                userPreviewSecondaryIdentifier: "text-primary/70",
              }
            }}
          />
        ) : (
          <div className="flex gap-2">
            <SignInButton mode="modal">
              <Button 
                variant="outline" 
                className="bg-black/95 backdrop-blur-sm border-primary/50 hover:bg-primary/10 text-primary transition-colors flex items-center gap-2"
                onClick={handleSignIn}
              >
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button 
                className="majestic-gradient text-black font-semibold shadow-lg transition-colors flex items-center gap-2"
                onClick={handleSignUp}
              >
                <Crown className="w-4 h-4" />
                Sign up
              </Button>
            </SignUpButton>
          </div>
        )}
      </div>
    </div>
  );
}