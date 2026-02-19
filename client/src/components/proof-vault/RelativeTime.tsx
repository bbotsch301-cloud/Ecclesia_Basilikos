import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface RelativeTimeProps {
  date: string | Date;
  className?: string;
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const d = new Date(date);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <time dateTime={d.toISOString()} className={className}>
          {formatDistanceToNow(d, { addSuffix: true })}
        </time>
      </TooltipTrigger>
      <TooltipContent>
        <span className="text-xs">{d.toLocaleString()}</span>
      </TooltipContent>
    </Tooltip>
  );
}
