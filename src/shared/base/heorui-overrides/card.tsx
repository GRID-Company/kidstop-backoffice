import { extendVariants, Card } from '@heroui/react';

const KidstopCard = extendVariants(Card, {
  variants: {
    variant: {
      default: {
        base: 'p-0',
        header: 'p-0',
        body: '!p-6',
      },
    },
  },
  defaultVariants: {
    radius: 'md',
    shadow: 'sm',
  },
});
export default KidstopCard;
