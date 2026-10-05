'use client';

import { PropsWithChildren } from 'react';
import Topbar from '../blocks/navigation/topbar';
import Sidenav from '../blocks/navigation/sidenav';
import CardScannerFab from '../base/buttons/card-scanner-fab';
import { CardScannerDrawer } from '@/features/card-scanner/ui/components/card-scanner-drawer';
import { useTcgTheme } from '@/lib/hooks/use-tcg-theme';

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  useTcgTheme();

  return (
    <div className='bg-page-bg relative min-h-screen transition-colors duration-500'>
      <div className='fixed top-0 bottom-0 left-0 z-50 hidden xl:flex'>
        <Sidenav />
      </div>

      <div className='min-h-screen p-4 xl:py-8 xl:pr-10 xl:pl-[144px]'>
        <div className='container mx-auto'>
          <Topbar />
          {children}
        </div>
      </div>

      <CardScannerFab />
      <CardScannerDrawer />
    </div>
  );
}
