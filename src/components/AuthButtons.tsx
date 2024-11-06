import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { MobileNav } from "./MobileNav";

export function AuthButtons() {
  const { isSignedIn } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-50">
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
                card: "bg-background/95 backdrop-blur-sm border-border",
                userPreviewMainIdentifier: "text-primary",
                userPreviewSecondaryIdentifier: "text-muted-foreground",
              }
            }}
          />
        ) : (
          <div className="flex gap-2">
            <SignInButton mode="modal">
              <Button variant="outline" className="bg-background/95 hover:bg-primary/10">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign up
              </Button>
            </SignUpButton>
          </div>
        )}
      </div>
    </div>
  );
}