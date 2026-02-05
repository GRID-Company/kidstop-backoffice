import { Skeleton } from '@heroui/react';

export default function UserSkeleton() {
  return (
    <div className='flex items-center space-x-2'>
      <Skeleton className='h-6 w-6 rounded-full' />
      <Skeleton className='h-4 w-20 rounded' />
    </div>
  );
}
