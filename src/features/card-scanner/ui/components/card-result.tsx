import { RefObject } from 'react';
import { CARD_DIMENSIONS } from '../../domain/constants';

interface CardResultProps {
  resultCanvasRef: RefObject<HTMLCanvasElement | null>;
}

export const CardResult = ({ resultCanvasRef }: CardResultProps) => {
  return (
    <div className='flex min-h-[490px] min-w-[350px] items-center justify-center overflow-hidden rounded-lg border-4 border-blue-500 bg-gray-800'>
      <canvas
        ref={resultCanvasRef}
        width={CARD_DIMENSIONS.width}
        height={CARD_DIMENSIONS.height}
        className='shadow-lg'
      />
    </div>
  );
};
