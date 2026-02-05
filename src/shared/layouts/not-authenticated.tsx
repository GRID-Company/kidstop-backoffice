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
    <div className='flex h-full min-h-screen w-full min-w-screen justify-center overflow-x-hidden bg-cover bg-no-repeat lg:items-center'>
      <div className='fixed top-0 left-0 z-0 h-full min-h-screen w-screen bg-cover bg-center bg-no-repeat' />

      <div className='mx-auto w-full max-w-[420px] p-8 lg:w-5/12 lg:p-12'>
        <Image
          src={Logo.src}
          alt='CANALVI'
          width={286}
          height={100}
          className='mx-auto mb-24'
        />
        {children}
        <p className='mt-6 w-full text-center text-xs'>{PROJECT_VERSION}</p>
      </div>

      <div
        className='hidden min-h-screen w-7/12 bg-cover lg:block'
        style={{ backgroundImage: `url(${BackImg.src})` }}
      ></div>
    </div>
  );
}
