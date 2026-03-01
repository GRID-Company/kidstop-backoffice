import { Drawer } from '@heroui/react';

type KidstopDrawerProps = React.ComponentProps<typeof Drawer>;

const KidstopDrawer = (props: KidstopDrawerProps) => (
  <Drawer
    {...props}
    classNames={{
      base: 'bg-white',
      header: 'border-b border-gray-100 text-content-primary font-semibold',
      body: 'bg-neutral-subtle/30',
      footer: 'border-t border-gray-100 bg-white',
      ...props.classNames,
    }}
  />
);

export default KidstopDrawer;
