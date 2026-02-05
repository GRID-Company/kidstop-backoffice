import { Image } from '@heroui/react';
import FallbackImg from '@/assets/img/fallback.webp';

interface ImageColProps {
  imgPath: string;
  isCover?: boolean;
  isSquare?: boolean;
}

export default function ImageCol({
  imgPath,
  isCover = false,
  isSquare = false,
}: ImageColProps) {
  return (
    <Image
      classNames={{
        wrapper: `bg-center bg-no-repeat object-center h-[60px] ${isSquare ? 'aspect-square' : 'aspect-[4/3]'} ${isCover ? 'object-cover bg-cover' : 'object-contain bg-contain'}`,
        img: ` aspect-auto w-full h-full ${isCover ? 'object-cover object-top' : 'object-contain object-center'}`,
      }}
      src={imgPath}
      fallbackSrc={
        imgPath === undefined || !imgPath ? FallbackImg.src : undefined
      }
    />
  );
}
