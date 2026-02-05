import { useAuthStore } from '@/lib/store/auth';
import UserSkeleton from '@/shared/base/skeletons/user-skeleton';
import { Icon } from '@iconify/react';

export default function UserPresenter() {
  const user = useAuthStore((state) => state.user);

  if (!user) return <UserSkeleton />;

  return (
    <div className='flex items-center gap-2'>
      <Icon icon='solar:user-circle-linear' className='text-xl text-white' />
      <p className='text-white'>{user?.name}</p>
    </div>
  );
}
