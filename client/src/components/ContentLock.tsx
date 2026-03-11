import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";

interface ContentLockProps {
  children: React.ReactNode;
  locked: boolean;
  message?: string;
}

export default function ContentLock({ children, locked, message = "PMA Member Content" }: ContentLockProps) {
  if (!locked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 rounded-lg">
        <div className="w-14 h-14 rounded-full bg-royal-gold/10 flex items-center justify-center">
          <Lock className="w-7 h-7 text-royal-gold" />
        </div>
        <p className="font-cinzel font-bold text-royal-navy text-lg">{message}</p>
        <p className="text-sm text-gray-500 max-w-xs text-center">
          Acquire PMA Beneficial Interest to unlock this content.
        </p>
        <Link href="/pricing">
          <Button className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold mt-1">
            <Crown className="w-4 h-4 mr-2" />
            Unlock Access
          </Button>
        </Link>
      </div>
    </div>
  );
}
