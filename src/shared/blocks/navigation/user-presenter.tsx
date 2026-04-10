'use client';

import { useAuthStore } from '@/lib/store/auth';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { TCG_THEMES } from '@/lib/consts/tcg-themes';
import UserSkeleton from '@/shared/base/skeletons/user-skeleton';
import { Icon } from '@iconify/react';
import { useLogout } from '@/lib/auth/use-process-logout';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react';

export default function UserPresenter() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogout();
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const tcgColor = TCG_THEMES[selectedTCG].accent;

  if (!user) return <UserSkeleton />;

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="light"
          className="flex items-center gap-2 px-2 py-1"
          startContent={
            <Icon icon="solar:user-circle-linear" className="text-xl text-content-primary" />
          }
        >
          <span className="text-content-primary">{user?.name}</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Opciones de usuario">
        <DropdownItem
          key="logout"
          startContent={<Icon icon="humbleicons:logout" />}
          onPress={() => {
            void logout();
          }}
          className="text-danger"
          style={{ color: tcgColor }}
        >
          <span style={{ color: tcgColor }}>Cerrar sesión</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
