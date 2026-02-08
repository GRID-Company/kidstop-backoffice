'use client';
import { PropsWithChildren } from 'react';
import BackImg from '@/assets/img/background.png';
import Logo from '@/assets/img/logo.png';
import Image from 'next/image';
import { PROJECT_VERSION } from '@/lib/consts/version';

export default function NotAuthenticatedLayout({
  children,
}: PropsWithChildren) {
  return (
    <div 
      className='relative flex h-full min-h-screen w-full min-w-screen justify-center items-center overflow-x-hidden bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${BackImg.src})` }}
    >
      <div className='absolute inset-0 bg-black/30' />
      <div className='relative z-10 mx-auto w-full max-w-[420px] p-8 lg:w-5/12 lg:p-12'>
        <div className='bg-white rounded-lg shadow-2xl border-t-4 border-blue-500 p-8'>
          <Image
            src={Logo.src}
            alt='CANALVI'
            width={286}
            height={100}
            className='mx-auto mb-8'
          />
          {children}
          <p className='mt-6 w-full text-center text-xs'>{PROJECT_VERSION}</p>
        </div>
      </div>
    </div>
  );
}
