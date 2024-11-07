import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { MobileNav } from "./MobileNav";
import { toast } from "./ui/use-toast";

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
                rootBox: "shadow-lg",
                card: "bg-black/95 backdrop-blur-sm border-amber-500/50",
                userPreviewMainIdentifier: "text-amber-400",
                userPreviewSecondaryIdentifier: "text-amber-200/70",
              }
            }}
          />
        ) : (
          <div className="flex gap-2">
            <SignInButton mode="modal">
              <Button 
                variant="outline" 
                className="bg-black/95 backdrop-blur-sm border-amber-500/50 hover:bg-amber-500/10 text-amber-400 transition-colors"
                onClick={handleSignIn}
              >
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button 
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-lg transition-colors"
                onClick={handleSignUp}
              >
                Sign up
              </Button>
            </SignUpButton>
          </div>
        )}
      </div>
    </div>
  );
}