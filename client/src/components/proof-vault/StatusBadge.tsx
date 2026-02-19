import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string | null;
  variant?: "compact" | "detailed";
}

export function StatusBadge({ status, variant = "compact" }: StatusBadgeProps) {
  const isDetailed = variant === "detailed";
  const iconSize = isDetailed ? "w-4 h-4" : "w-3 h-3";
  const badgeSize = isDetailed ? "text-sm px-3 py-1" : "";

  switch (status) {
    case "confirmed":
      return (
        <Badge className={`bg-green-100 text-green-700 border-green-300 ${badgeSize}`}>
          <CheckCircle2 className={`${iconSize} mr-1`} />
          {isDetailed ? "Confirmed on Bitcoin" : "Confirmed"}
        </Badge>
      );
    case "pending":
      return (
        <Badge className={`bg-yellow-100 text-yellow-700 border-yellow-300 ${badgeSize}`}>
          <Clock className={`${iconSize} mr-1`} />
          {isDetailed ? "Pending Confirmation" : "Pending"}
        </Badge>
      );
    case "failed":
      return (
        <Badge className={`bg-red-100 text-red-700 border-red-300 ${badgeSize}`}>
          <XCircle className={`${iconSize} mr-1`} />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}
