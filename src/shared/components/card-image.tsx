'use client';

import Image from 'next/image';
import { memo } from 'react';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';

interface CardImageProps {
  src?: string | null;
  alt: string;
  tcgType: 'POKEMON' | 'MAGIC';
  className?: string;
  containerClassName?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  fill?: boolean;
  sizes?: string;
}

function CardImageComponent({
  src,
  alt,
  tcgType,
  className = 'object-contain',
  containerClassName = 'relative bg-default-100',
  onError,
  fill = false,
  sizes,
}: CardImageProps) {
  const placeholder = tcgType === 'MAGIC' ? magicCardPlaceholder : pokemonCardPlaceholder;

  if (fill) {
    return (
      <div className={containerClassName}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={className}
            onError={onError}
          />
        ) : (
          <Image
            src={placeholder}
            alt={`${tcgType} card placeholder`}
            fill
            sizes={sizes}
            className={className}
          />
        )}
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${className}`}
          onError={onError}
        />
      ) : (
        <Image
          src={placeholder}
          alt={`${tcgType} card placeholder`}
          fill
          className={className}
        />
      )}
    </div>
  );
}

export const CardImage = memo(CardImageComponent);
