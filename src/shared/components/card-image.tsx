'use client';

import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
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

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.(e);
  };

  const showPlaceholder = !src || hasError;
  const isInteractive = enablePreview && !!onImageClick;

  const handleClick = (e: React.MouseEvent) => {
    if (isInteractive) {
      e.stopPropagation();
      onImageClick();
    }
  };

  const handlePointerEvent = (e: React.PointerEvent) => {
    if (isInteractive) {
      e.stopPropagation();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && e.key === 'Enter') {
      e.stopPropagation();
      onImageClick();
    }
  };

  const interactiveProps = isInteractive
    ? {
        onClick: handleClick,
        onPointerDown: handlePointerEvent,
        onPointerUp: handlePointerEvent,
        onKeyDown: handleKeyDown,
        role: 'button' as const,
        tabIndex: 0,
        'aria-label': `Ver ${alt} en tamaño completo`,
      }
    : {};

  const containerClasses = `${containerClassName} ${
    isInteractive ? 'cursor-pointer transition-opacity hover:opacity-80' : ''
  }`;

  if (fill) {
    return (
      <div className={containerClasses} {...interactiveProps}>
        {showPlaceholder ? (
          <Image
            src={placeholder}
            alt={`${tcgType} card placeholder`}
            fill
            sizes={sizes}
            className={className}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={className}
            onError={handleError}
            unoptimized
          />
        )}
      </div>
    );
  }

  return (
    <div className={containerClasses} {...interactiveProps}>
      {showPlaceholder ? (
        <Image
          src={placeholder}
          alt={`${tcgType} card placeholder`}
          fill
          className={className}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${className}`}
          onError={handleError}
        />
      )}
    </div>
  );
}

export const CardImage = memo(CardImageComponent);
