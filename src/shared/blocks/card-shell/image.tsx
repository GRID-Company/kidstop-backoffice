'use client';

import { PropsWithChildren } from 'react';
import { CardImage } from '@/shared/components/card-image';
import { useCardShell } from './context';

interface ImageProps extends PropsWithChildren {
  className?: string;
  sizes?: string;
}

export default function Image({
  className,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw',
  children,
}: ImageProps) {
  const { tcgType, imageSrc, alt, available, compact, openPreview } =
    useCardShell();

  return (
    <div
      className={`bg-default-100 relative mx-3 mb-2 grid place-items-center overflow-hidden rounded-lg ${
        compact ? 'mt-2 aspect-5/7 p-1.5' : 'mt-2.5 aspect-5/7 p-3'
      } ${className ?? ''}`}
    >
      <CardImage
        src={imageSrc}
        alt={alt}
        tcgType={tcgType}
        containerClassName='absolute inset-0'
        className={`object-contain drop-shadow-md transition-opacity ${
          available ? '' : 'opacity-50'
        } ${compact ? 'p-1.5' : 'p-2.5'}`}
        fill
        sizes={sizes}
        enablePreview
        onImageClick={openPreview}
      />
      {children}
    </div>
  );
}
