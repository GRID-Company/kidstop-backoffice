import { extendVariants, Card } from '@heroui/react';

const CanalviCard = extendVariants(Card, {
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
export default CanalviCard;
