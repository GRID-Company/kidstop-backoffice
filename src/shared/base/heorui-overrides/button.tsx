import { extendVariants, Button } from '@heroui/react';

const KidstopButton = extendVariants(Button, {
  variants: {
    variant: {
      borderedWhite: 'border-1 border-white !text-white ',
      light: '!text-white ',
    },
  },
  defaultVariants: {
    variant: 'borderedWhite',
    size: 'md',
  },
});
export default KidstopButton;
