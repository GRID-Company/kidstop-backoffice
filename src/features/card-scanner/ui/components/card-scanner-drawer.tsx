'use client';

import { DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import { useCardScannerStore } from '@/lib/store/card-scanner';
import { ScannerPanel } from './scanner-panel';

export const CardScannerDrawer = () => {
  const isOpen = useCardScannerStore((state) => state.isOpen);
  const source = useCardScannerStore((state) => state.source);
  const closeScanner = useCardScannerStore((state) => state.closeScanner);

  return (
    <KidstopDrawer
      isOpen={isOpen}
      onClose={closeScanner}
      size='xl'
      placement='right'
    >
      <DrawerContent>
        <DrawerHeader className='flex flex-col gap-1'>
          <span className='text-accent text-lg font-semibold'>
            Escáner de cartas
          </span>
          <span className='text-default-500 text-sm font-normal'>
            Posiciona la carta dentro del marco para identificarla
          </span>
        </DrawerHeader>
        <DrawerBody>{isOpen && <ScannerPanel source={source} />}</DrawerBody>
      </DrawerContent>
    </KidstopDrawer>
  );
};
