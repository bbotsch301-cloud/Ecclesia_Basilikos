import { Crown } from "lucide-react";

interface PremiumBadgeProps {
  size?: "sm" | "md";
}

export default function PremiumBadge({ size = "sm" }: PremiumBadgeProps) {
  if (size === "md") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-royal-gold/10 text-royal-gold border border-royal-gold/30 px-3 py-1 rounded-full text-xs font-cinzel font-semibold">
        <Crown className="w-3.5 h-3.5" />
        PMA Member
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-royal-gold/10 text-royal-gold px-2 py-0.5 rounded-full text-[10px] font-cinzel font-semibold">
      <Crown className="w-3 h-3" />
      PMA Member
    </span>
  );
}
