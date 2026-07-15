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
  enablePreview?: boolean;
  onImageClick?: () => void;
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
  enablePreview = false,
  onImageClick,
}: CardImageProps) {
  const placeholder =
    tcgType === 'MAGIC' ? magicCardPlaceholder : pokemonCardPlaceholder;

  const wrapperClassName =
    enablePreview && onImageClick
      ? 'cursor-pointer hover:opacity-80 transition-opacity'
      : '';

  const handleClick = (e: React.MouseEvent) => {
    if (enablePreview && onImageClick) {
      e.stopPropagation();
      onImageClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (enablePreview && onImageClick && e.key === 'Enter') {
      e.stopPropagation();
      onImageClick();
    }
  };

  const imageContent = fill ? (
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
  ) : (
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

  if (enablePreview && onImageClick) {
    return (
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={wrapperClassName}
        role='button'
        tabIndex={0}
        aria-label={`Ver ${alt} en tamaño completo`}
      >
        {imageContent}
      </div>
    );
  }

  return imageContent;
}

export const CardImage = memo(CardImageComponent);
