import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import UpgradePrompt from "@/components/UpgradePrompt";

export default function RequirePremium({ children }: { children: React.ReactNode }) {
  const { isPremium, isAdmin, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center p-4">
        <UpgradePrompt
          title="Sign In Required"
          description="Please sign in or create an account to access this content."
        />
      </div>
    );
  }

  if (isPremium || isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center p-4">
      <UpgradePrompt />
    </div>
  );
}
