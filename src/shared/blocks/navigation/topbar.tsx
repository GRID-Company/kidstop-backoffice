import { Icon } from '@iconify/react';
import Image from 'next/image';
import Logo from '@/assets/img/logo.png';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Link,
} from '@heroui/react';
import { MENU_ROUTES } from '@/lib/consts/navigation-routes';
import { PROJECT_VERSION } from '@/lib/consts/version';
import { UserRole } from '@/lib/auth/user-roles';
import { useLogout } from '@/lib/auth/use-process-logout';
import { useAuthStore } from '@/lib/store/auth';
import TcgSelector from '@/shared/base/tcg-selector';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import UserPresenter from './user-presenter';

export default function Topbar({ className }: { className?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useLogout();
  const pathname = usePathname();
  const router = useRouter();
  const role = useAuthStore((state) => state.role);

  const navigateTo = (route: string) => {
    setIsMenuOpen(false);
    router.push(route);
  };

  return (
    <>
      <Navbar
        className={`bg-page-bg xl:!bg-transparent shadow-none ${className} sticky top-0 z-40`}
        isBlurred={false}
        classNames={{
          wrapper:
            'px-4 lg:px-0 h-12 xl:h-22 max-w-full border-b border-gray-200 bg-page-bg xl:!bg-transparent',
        }}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent className='' justify='start'>
          <div className='flex shrink-0 items-center justify-center'>
            <h1 className=''>
              <Image
                src={Logo.src}
                alt='Kidstop'
                width={220}
                height={77}
                decoding='sync'
                className='h-8 w-auto xl:h-auto xl:w-[220px]'
              />
            </h1>
          </div>
        </NavbarContent>

        <NavbarContent justify='end' className='hidden gap-6 pr-6 xl:flex'>
          <TcgSelector />
          <UserPresenter />
        </NavbarContent>

        <NavbarContent justify='end' className='xl:hidden'>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
        </NavbarContent>

        <NavbarMenu className='top-12 !bg-page-bg px-4 py-8 xl:hidden'>
          <NavbarMenuItem key='tcg-selector' className='mb-2'>
            <TcgSegmentedSelector />
          </NavbarMenuItem>

          {(MENU_ROUTES?.[role as UserRole] ?? []).map((option, index) => {
            const isActive = pathname.includes(option.route);
            return (
              <NavbarMenuItem key={`${option.label}-${index}`}>
                <Link
                  color='primary'
                  className={`text-foreground mb-2 flex h-12 items-center gap-4 rounded-lg px-4 !opacity-100 hover:bg-[#CDD3E8] ${
                    isActive ? '!bg-[#CDD3E8]' : ''
                  }`}
                  onPress={() => {
                    navigateTo(option.route);
                  }}
                >
                  <Icon icon={`${option.icon}`} className='shrink-0 text-2xl' />
                  <span className='text-base'>{option.label}</span>
                </Link>
              </NavbarMenuItem>
            );
          })}

          <NavbarMenuItem key='cerrar-sesion'>
            <Button
              color='primary'
              variant='light'
              className='text-foreground mb-2 !flex h-12 w-full !min-w-full items-center justify-start !gap-0 rounded-lg !px-4'
              onPress={() => {
                setIsMenuOpen(false);
                logout();
              }}
            >
              <Icon icon='humbleicons:logout' className='shrink-0 text-2xl' />
              <span className='ml-4 text-base whitespace-nowrap'>
                Cerrar sesión
              </span>
            </Button>
          </NavbarMenuItem>
          <p className='mb-3 text-center text-xs'>{PROJECT_VERSION}</p>
        </NavbarMenu>
      </Navbar>

      <div className='mb-6'></div>
    </>
  );
}
