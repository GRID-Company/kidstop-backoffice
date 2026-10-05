'use client';

import { Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import KidstopButton from '@/shared/base/heorui-overrides/button';
import { useCardScannerStore } from '@/lib/store/card-scanner';

export default function CardScannerFab() {
  const isOpen = useCardScannerStore((state) => state.isOpen);
  const openScanner = useCardScannerStore((state) => state.openScanner);

  if (isOpen) return null;

  return (
    <Tooltip
      content='Escanear carta'
      placement='left'
      delay={100}
      className='text-xs font-medium'
    >
      <KidstopButton
        variant='accent'
        isIconOnly
        radius='full'
        size='lg'
        className='fixed right-6 bottom-6 z-40 h-14 w-14 shadow-xl'
        aria-label='Escanear carta'
        onPress={() => openScanner('fab')}
      >
        <Icon icon='lucide:scan-line' className='text-2xl' />
      </KidstopButton>
    </Tooltip>
  );
}
