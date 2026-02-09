import NextLink from 'next/link';

import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Button, Link } from '@heroui/react';
import { MENU_ROUTES } from '@/lib/consts/navigation-routes';
import { useLogout } from '@/lib/auth/use-process-logout';
import { PROJECT_VERSION } from '@/lib/consts/version';
import { useAuthStore } from '@/lib/store/auth';
import { UserRole } from '@/lib/auth/user-roles';

export default function Sidenav() {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.role);
  const { logout } = useLogout();

  return (
    <div className='min-h-screen p-8'>
      <div
        className='flex h-full w-20 flex-col overflow-hidden rounded-2xl transition-all duration-500'
        style={{ background: 'var(--tcg-sidebar-bg)' }}
      >
        <div className='mt-6 flex h-full flex-col justify-between px-4'>
          <div className='flex flex-col gap-2 pt-6'>
            {(MENU_ROUTES?.[role as UserRole] ?? []).map((option) => {
              const isActive = pathname.includes(option.route);
              return (
                <Link
                  href={option.route}
                  as={NextLink}
                  key={option.label}
                  isBlock
                  className='flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300'
                  style={isActive ? { background: 'var(--tcg-sidebar-active)' } : undefined}
                >
                  <Icon
                    icon={`${option.icon}`}
                    className='shrink-0 text-2xl text-white'
                  />
                </Link>
              );
            })}
          </div>

          <div className='w-full'>
            <Button
              color='primary'
              variant='light'
              className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl`}
              onPress={() => {
                void logout();
              }}
              isIconOnly
            >
              <Icon
                icon='humbleicons:logout'
                className='shrink-0 text-2xl text-white'
              />
            </Button>
            <p className='mt-2 mb-4 text-center text-xs text-white'>
              {PROJECT_VERSION}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
