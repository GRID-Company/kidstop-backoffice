'use client';

import { motion } from 'framer-motion';

interface CardPositioningGuideProps {
  cardDetected: boolean;
  showGrid?: boolean;
}

const TCG_CARD_RATIO = 1.4;
const GUIDE_WIDTH_PERCENTAGE = 65;

export const CardPositioningGuide = ({
  cardDetected,
  showGrid = true,
}: CardPositioningGuideProps) => {
  const strokeColor = cardDetected ? '#10b981' : '#3b82f6';
  const strokeWidth = cardDetected ? 3 : 2;
  const opacity = cardDetected ? 0.8 : 0.5;

  const viewBoxWidth = 100;
  const viewBoxHeight = 100;

  const guideWidth = GUIDE_WIDTH_PERCENTAGE;
  const guideHeight = GUIDE_WIDTH_PERCENTAGE * TCG_CARD_RATIO;

  const guideX = (viewBoxWidth - guideWidth) / 2;
  const guideY = (viewBoxHeight - guideHeight) / 2;

  return (
    <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
      <svg
        className='h-full w-full'
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <filter id='glow'>
            <feGaussianBlur stdDeviation='2' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        {showGrid && (
          <g opacity={opacity * 0.3}>
            <line
              x1={guideX + guideWidth / 3}
              y1={guideY}
              x2={guideX + guideWidth / 3}
              y2={guideY + guideHeight}
              stroke={strokeColor}
              strokeWidth='0.2'
              strokeDasharray='2,2'
            />
            <line
              x1={guideX + (guideWidth * 2) / 3}
              y1={guideY}
              x2={guideX + (guideWidth * 2) / 3}
              y2={guideY + guideHeight}
              stroke={strokeColor}
              strokeWidth='0.2'
              strokeDasharray='2,2'
            />
            <line
              x1={guideX}
              y1={guideY + guideHeight / 3}
              x2={guideX + guideWidth}
              y2={guideY + guideHeight / 3}
              stroke={strokeColor}
              strokeWidth='0.2'
              strokeDasharray='2,2'
            />
            <line
              x1={guideX}
              y1={guideY + (guideHeight * 2) / 3}
              x2={guideX + guideWidth}
              y2={guideY + (guideHeight * 2) / 3}
              stroke={strokeColor}
              strokeWidth='0.2'
              strokeDasharray='2,2'
            />
          </g>
        )}

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          transition={{ duration: 0.3 }}
        >
          <rect
            x={guideX}
            y={guideY}
            width={guideWidth}
            height={guideHeight}
            fill='none'
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            rx='2'
            filter={cardDetected ? 'url(#glow)' : undefined}
          />

          <g opacity={opacity}>
            <line
              x1={guideX}
              y1={guideY}
              x2={guideX + 8}
              y2={guideY}
              stroke={strokeColor}
              strokeWidth={strokeWidth + 1}
              strokeLinecap='round'
            />
            <line
              x1={guideX}
              y1={guideY}
              x2={guideX}
              y2={guideY + 8}
              stroke={strokeColor}
              strokeWidth={strokeWidth + 1}
              strokeLinecap='round'
            />

            <line
              x1={guideX + guideWidth}
              y1={guideY}
              x2={guideX + guideWidth - 8}
              y2={guideY}
              stroke={strokeColor}
              strokeWidth={strokeWidth + 1}
              strokeLinecap='round'
            />
            <line
              x1={guideX + guideWidth}
              y1={guideY}
              x2={guideX + guideWidth}
              y2={guideY + 8}
              stroke={strokeColor}
              strokeWidth={strokeWidth + 1}
              strokeLinecap='round'
            />

            <line
              x1={guideX}
              y1={guideY + guideHeight}
              x2={guideX + 8}
              y2={guideY + guideHeight}
              stroke={strokeColor}
              strokeWidth={strokeWidth + 1}
              strokeLinecap='round'
            />
            <line
              x1={guideX}
              y1={guideY + guideHeight}
              x2={guideX}
              y2={guideY + guideHeight - 8}
              stroke={strokeColor}
              strokeWidth={strokeWidth + 1}
              strokeLinecap='round'
            />

            <line
              x1={guideX + guideWidth}
              y1={guideY + guideHeight}
              x2={guideX + guideWidth - 8}
              y2={guideY + guideHeight}
              stroke={strokeColor}
              strokeWidth={strokeWidth + 1}
              strokeLinecap='round'
            />
            <line
              x1={guideX + guideWidth}
              y1={guideY + guideHeight}
              x2={guideX + guideWidth}
              y2={guideY + guideHeight - 8}
              stroke={strokeColor}
              strokeWidth={strokeWidth + 1}
              strokeLinecap='round'
            />
          </g>
        </motion.g>

        {!cardDetected && (
          <motion.g
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <text
              x='50'
              y='8'
              textAnchor='middle'
              fill={strokeColor}
              fontSize='3'
              fontWeight='600'
            >
              Posiciona la carta dentro del marco
            </text>
          </motion.g>
        )}

        {cardDetected && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <text
              x='50'
              y='8'
              textAnchor='middle'
              fill={strokeColor}
              fontSize='3'
              fontWeight='600'
            >
              ✓ Carta detectada
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  );
};
