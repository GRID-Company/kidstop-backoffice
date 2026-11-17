import { extendVariants, Modal } from '@heroui/react';

const KidstopModal = extendVariants(Modal, {
  variants: {
    size: {
      md: {
        base: 'max-w-md',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    placement: 'center',
    backdrop: 'opaque',
  },
});

type KidstopModalProps = React.ComponentProps<typeof KidstopModal>;

const StyledModal = (props: KidstopModalProps) => (
  <KidstopModal
    {...props}
    classNames={{
      base: 'bg-white rounded-xl border border-gray-200 shadow-lg',
      wrapper: 'h-(--vv-height) translate-y-(--visual-viewport-offset-top)',
      backdrop: 'translate-y-(--visual-viewport-offset-top)',
      header: 'border-b border-gray-100 text-content-primary font-semibold',
      body: 'text-content-tertiary min-h-0 overflow-y-auto',
      footer: 'border-t border-gray-100',
      ...props.classNames,
    }}
  />
);

export default StyledModal;
