import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location)}`);
    }
  }, [isLoading, isAuthenticated, location, navigate]);

  if (isLoading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
