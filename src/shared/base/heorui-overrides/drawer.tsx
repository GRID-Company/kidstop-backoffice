import { Drawer } from '@heroui/react';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { BREAKPOINTS } from '@/lib/consts/breakpoints';

type KidstopDrawerProps = React.ComponentProps<typeof Drawer> & {
  fullScreenOnTablet?: boolean;
};

const KidstopDrawer = ({ fullScreenOnTablet = true, ...props }: KidstopDrawerProps) => {
  const isTablet = useMediaQuery(BREAKPOINTS.TABLET_MAX);
  const effectiveSize = isTablet && fullScreenOnTablet ? 'full' : props.size;

  return (
    <Drawer
      {...props}
      size={effectiveSize}
      classNames={{
        base: 'bg-white',
        header: 'border-b border-gray-100 text-content-primary font-semibold',
        body: 'bg-neutral-subtle/30',
        footer: 'border-t border-gray-100 bg-white',
        ...props.classNames,
      }}
    />
  );
};

export default KidstopDrawer;
