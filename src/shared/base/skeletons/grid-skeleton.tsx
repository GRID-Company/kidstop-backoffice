// File: src/features/windows/ui/components/create-update/window-profiles-grid-skeleton.tsx
import { Skeleton } from '@heroui/react';

interface WindowProfilesGridSkeletonProps {
  count?: number;
}

export default function GridSkeleton({
  count = 6,
}: WindowProfilesGridSkeletonProps) {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className='group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md'
          >
            {/* Image with Mosquito Net Badge */}
            <div className='relative h-40 w-full bg-gray-100'>
              <Skeleton className='h-full w-full' />
            </div>

            {/* Content */}
            <div className='p-4'>
              {/* Title */}
              <div className='mb-3'>
                <Skeleton className='h-5 w-32' />
              </div>

              {/* Details Grid */}
              <div className='space-y-2'>
                <Skeleton className='mt-1 h-4 w-24' />
                <Skeleton className='mt-1 h-4 w-32' />
                <div className='grid grid-cols-2 gap-4 pt-2'>
                  <Skeleton className='mt-1 h-4 w-12' />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
