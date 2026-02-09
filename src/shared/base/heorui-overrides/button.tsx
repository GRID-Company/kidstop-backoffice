import { extendVariants, Button } from '@heroui/react';

const KidstopButton = extendVariants(Button, {
  variants: {
    variant: {
      borderedWhite: 'border-1 border-white !text-white ',
      light: '!text-white ',
      lightDark: '!text-content-primary ',
      borderedDark: 'border-1 border-content-primary !text-content-primary ',
      accent: 'bg-accent !text-white hover:opacity-90 ',
    },
  },
  defaultVariants: {
    variant: 'borderedWhite',
    size: 'md',
  },
});
export default KidstopButton;
