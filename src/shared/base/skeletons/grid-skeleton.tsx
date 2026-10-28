import { Skeleton } from '@heroui/react';

interface GridSkeletonProps {
  count?: number;
}

export default function GridSkeleton({ count = 10 }: GridSkeletonProps) {
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5'>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className='border-default-200 overflow-hidden rounded-lg border bg-white'
        >
          <div className='flex items-center justify-between px-3 pt-2.5'>
            <Skeleton className='h-3 w-16 rounded-md' />
            <Skeleton className='h-3 w-10 rounded-md' />
          </div>
          <div className='mx-3 mt-2.5 mb-2'>
            <Skeleton className='aspect-5/7 w-full rounded-lg' />
          </div>
          <div className='flex flex-col gap-2 px-3 pb-2'>
            <Skeleton className='h-4 w-3/4 rounded-md' />
            <Skeleton className='h-3 w-1/2 rounded-md' />
            <div className='mt-2 flex items-end justify-between'>
              <div className='flex flex-col gap-1'>
                <Skeleton className='h-2.5 w-14 rounded-md' />
                <Skeleton className='h-5 w-16 rounded-md' />
              </div>
              <Skeleton className='h-4 w-6 rounded-md' />
            </div>
            <Skeleton className='mt-1 h-5 w-24 rounded-md' />
          </div>
          <div className='border-default-100 bg-default-50 border-t px-3 py-2.5'>
            <Skeleton className='h-8 w-full rounded-md' />
          </div>
        </div>
      ))}
    </div>
  );
}
