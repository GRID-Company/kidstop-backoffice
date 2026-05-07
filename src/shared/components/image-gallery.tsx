'use client';

import { useState, useMemo } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';

interface ImageResolution {
  resolution: string;
  imageUrl: string;
}

interface ImageGalleryProps {
  images: ImageResolution[];
  alt: string;
  minResolution?: number;
}

export default function ImageGallery({
  images,
  alt,
  minResolution = 400,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const resolution = parseInt(img.resolution.split('x')[0]);
      return resolution >= minResolution;
    }).sort((a, b) => {
      const resA = parseInt(a.resolution.split('x')[0]);
      const resB = parseInt(b.resolution.split('x')[0]);
      return resA - resB;
    });
  }, [images, minResolution]);

  if (filteredImages.length === 0) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  const currentImage = filteredImages[currentIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-default-100">
        <img
          src={currentImage.imageUrl}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain p-2"
          loading="lazy"
        />

        {filteredImages.length > 1 && (
          <>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80"
              onPress={handlePrevious}
              aria-label="Imagen anterior"
            >
              <Icon icon="lucide:chevron-left" width={18} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80"
              onPress={handleNext}
              aria-label="Siguiente imagen"
            >
              <Icon icon="lucide:chevron-right" width={18} />
            </Button>
          </>
        )}
      </div>

      {filteredImages.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          {filteredImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-4 bg-accent'
                  : 'bg-default-300 hover:bg-default-400'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-default-400">
        Resolución: {currentImage.resolution}
      </p>
    </div>
  );
}
