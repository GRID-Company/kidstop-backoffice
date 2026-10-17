'use client';

import { motion } from 'framer-motion';

interface CardPositioningGuideProps {
  cardDetected: boolean;
}

const TCG_CARD_RATIO = 1.4;
const GUIDE_WIDTH_PERCENTAGE = 65;
const CORNER_LENGTH = 12;
const CORNER_RADIUS = 2;

export const CardPositioningGuide = ({
  cardDetected,
}: CardPositioningGuideProps) => {
  const strokeColor = cardDetected ? '#10b981' : 'var(--color-accent)';
  const strokeWidth = cardDetected ? 1.6 : 1.2;

  const guideWidth = GUIDE_WIDTH_PERCENTAGE;
  const guideHeight = GUIDE_WIDTH_PERCENTAGE * TCG_CARD_RATIO;
  const guideX = (100 - guideWidth) / 2;
  const guideY = (100 - guideHeight) / 2;

  const l = CORNER_LENGTH;
  const r = CORNER_RADIUS;
  const x0 = guideX;
  const y0 = guideY;
  const x1 = guideX + guideWidth;
  const y1 = guideY + guideHeight;

  const cornerBrackets = [
    `M ${x0 + l} ${y0} L ${x0 + r} ${y0} Q ${x0} ${y0} ${x0} ${y0 + r} L ${x0} ${y0 + l}`,
    `M ${x1 - l} ${y0} L ${x1 - r} ${y0} Q ${x1} ${y0} ${x1} ${y0 + r} L ${x1} ${y0 + l}`,
    `M ${x0 + l} ${y1} L ${x0 + r} ${y1} Q ${x0} ${y1} ${x0} ${y1 - r} L ${x0} ${y1 - l}`,
    `M ${x1 - l} ${y1} L ${x1 - r} ${y1} Q ${x1} ${y1} ${x1} ${y1 - r} L ${x1} ${y1 - l}`,
  ].join(' ');

  return (
    <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
      <svg
        className='h-full w-full'
        viewBox='0 0 100 100'
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <clipPath id='card-frame-clip'>
            <rect
              x={guideX}
              y={guideY}
              width={guideWidth}
              height={guideHeight}
              rx={CORNER_RADIUS}
            />
          </clipPath>
          <filter id='glow'>
            <feGaussianBlur stdDeviation='2' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        <path
          fillRule='evenodd'
          fill='rgba(0, 0, 0, 0.45)'
          d={`M 0 0 H 100 V 100 H 0 Z M ${guideX} ${guideY} h ${guideWidth} v ${guideHeight} h ${-guideWidth} Z`}
        />

        {!cardDetected && (
          <g clipPath='url(#card-frame-clip)'>
            <motion.rect
              x={guideX}
              width={guideWidth}
              height={1.4}
              fill={strokeColor}
              opacity={0.6}
              initial={{ y: guideY + 2 }}
              animate={{
                y: [guideY + 2, guideY + guideHeight - 3.4, guideY + 2],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </g>
        )}

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <path
            d={cornerBrackets}
            fill='none'
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            filter={cardDetected ? 'url(#glow)' : undefined}
          />

          {cardDetected && (
            <motion.rect
              x={guideX}
              y={guideY}
              width={guideWidth}
              height={guideHeight}
              fill='#10b981'
              fillOpacity={0.08}
              rx={CORNER_RADIUS}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.g>

        {cardDetected && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <circle cx={50} cy={guideY - 2.5} r={3.2} fill='#10b981' />
            <path
              d={`M ${50 - 1.4} ${guideY - 2.5} l 0.9 0.9 l 1.9 -1.9`}
              stroke='#ffffff'
              strokeWidth={0.7}
              strokeLinecap='round'
              strokeLinejoin='round'
              fill='none'
            />
          </motion.g>
        )}
      </svg>
    </div>
  );
};
