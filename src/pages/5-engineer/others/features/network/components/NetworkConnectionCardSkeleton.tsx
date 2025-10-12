import { Card, CardContent, CardHeader } from '../../../../../1-HomePage/others/components/ui/card';
import { Skeleton } from '../../../../../1-HomePage/others/components/ui/skeleton';

export function NetworkConnectionCardSkeleton() {
  return (
    <Card className="gap-0 border-border/50">
      <CardHeader className="p-5 pb-3 border-b border-border/40">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-full mt-2" />
            </div>
          </div>
          
          {/* Right */}
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
        {/* Metadata Grid */}
        <div className="grid grid-cols-3 gap-4 py-3 border-y border-border/40">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>

        {/* Activity */}
        <Skeleton className="h-16 w-full rounded-lg" />

        {/* Badges */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Stats Row */}
        <Skeleton className="h-4 w-full" />

        {/* Buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-7 flex-1" />
          <Skeleton className="h-7 flex-1" />
          <Skeleton className="h-7 flex-1" />
          <Skeleton className="h-7 w-7" />
        </div>
      </CardContent>
    </Card>
  );
}

