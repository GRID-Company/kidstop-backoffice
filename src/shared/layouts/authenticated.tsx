'use client';

import { PropsWithChildren } from 'react';
import Topbar from '../blocks/navigation/topbar';
import Sidenav from '../blocks/navigation/sidenav';

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <>
      <div className='relative bg-[#FBFCFD] pb-[180px] transition-all duration-200 md:pb-0'>
        <div className='bg-brand-2 absolute inset-x-0 z-0 h-[360px] w-full' />

        <div className='fixed top-0 bottom-0 left-0 z-50 hidden xl:flex'>
          <Sidenav />
        </div>

        <div className='relative min-h-[calc(100vh-4rem)] p-4 xl:mt-0 xl:py-8 xl:pr-10 xl:pl-[144px]'>
          <div className='container mx-auto mb-18'>
            <Topbar />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
