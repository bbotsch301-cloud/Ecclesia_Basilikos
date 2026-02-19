import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HashDisplayProps {
  hash: string;
  className?: string;
}

export function HashDisplay({ hash, className }: HashDisplayProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <code className={cn("font-mono", className)}>
          <span className="sm:hidden">
            {hash.slice(0, 8)}&hellip;{hash.slice(-8)}
          </span>
          <span className="hidden sm:inline truncate">{hash}</span>
        </code>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <code className="font-mono text-xs break-all">{hash}</code>
      </TooltipContent>
    </Tooltip>
  );
}
