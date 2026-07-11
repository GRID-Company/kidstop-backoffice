'use client';

import { Spinner } from '@heroui/react';

export default function Loading() {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-2'>
      <Spinner className='pt-14' label='Cargando...' />
    </div>
  );
}
