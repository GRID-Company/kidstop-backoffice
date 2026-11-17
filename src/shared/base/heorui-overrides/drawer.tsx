import { Drawer } from '@heroui/react';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { BREAKPOINTS } from '@/lib/consts/breakpoints';

type KidstopDrawerProps = React.ComponentProps<typeof Drawer> & {
  fullScreenOnTablet?: boolean;
};

const KidstopDrawer = ({
  fullScreenOnTablet = true,
  ...props
}: KidstopDrawerProps) => {
  const isTablet = useMediaQuery(BREAKPOINTS.TABLET_MAX);
  const isFullScreen = isTablet && fullScreenOnTablet;
  const effectiveSize = isFullScreen ? 'full' : props.size;

  return (
    <Drawer
      {...props}
      size={effectiveSize}
      classNames={{
        base: `bg-white overflow-y-hidden${isFullScreen ? ' min-h-0 h-(--vv-full) pb-(--vv-strip)' : ''}`,
        wrapper:
          'h-(--vv-full) overflow-y-hidden translate-y-(--visual-viewport-offset-top)',
        backdrop: 'translate-y-(--visual-viewport-offset-top)',
        header: 'border-b border-gray-100 text-content-primary font-semibold',
        body: 'bg-neutral-subtle/30 min-h-0 overflow-y-auto',
        footer: 'border-t border-gray-100 bg-white',
        ...props.classNames,
      }}
    />
  );
};

export default KidstopDrawer;
