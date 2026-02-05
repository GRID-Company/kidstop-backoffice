'use client';
import Image from 'next/image';
// import LogoFull from '@/assets/img/logo.webp';

export default function Loading() {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-2'>
      {/* <Image src={LogoFull} width={164} height={32} alt='Logo' /> */}
      <div>Cargando...</div>
    </div>
  );
}
