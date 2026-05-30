import { Skeleton } from '@heroui/react';

export default function PriceMetricsSkeleton() {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-0.5">
        <Skeleton className="h-2.5 w-2.5 rounded-full" />
        <Skeleton className="h-2.5 w-20 rounded" />
      </div>
      <div className="flex items-center gap-0.5">
        <Skeleton className="h-2.5 w-2.5 rounded-full" />
        <Skeleton className="h-2.5 w-16 rounded" />
      </div>
      <div className="flex items-center gap-0.5">
        <Skeleton className="h-2.5 w-2.5 rounded-full" />
        <Skeleton className="h-2.5 w-16 rounded" />
      </div>
    </div>
  );
}
