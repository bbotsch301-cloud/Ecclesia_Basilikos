import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ProofDetailSkeleton() {
  return (
    <div className="pt-16">
      {/* Hero skeleton */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-10 md:py-14">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <Skeleton className="h-7 w-40 mx-auto rounded-full bg-white/10" />
          <Skeleton className="h-8 w-64 mx-auto bg-white/10" />
          <Skeleton className="h-4 w-48 mx-auto bg-white/10" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action bar skeleton */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-9 w-20" />
          <div className="flex gap-3">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>

        <div className="grid gap-6">
          {/* Primary info card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
              <Separator />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Verification card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
