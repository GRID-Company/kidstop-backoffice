import { Tabs, Tab, SortDescriptor } from '@heroui/react';
import PerfilesList from './lists/profiles-list';
import HerrajesList from './lists/chapes-list';
import VariosList from './lists/various-list';
import VidriosList from './lists/glasses-list';
import { PropsWithChildren } from 'react';
import { InventoryListProps } from '../../domain/inventory-lists.domain';

interface TabProps extends InventoryListProps<any> {
  total: number;
}

type InventoryTabsCompound = React.FC<any> & {
  TabTitle: typeof TabTitle;
};

function TabTitle({ total = 0, label }: { total: number; label: string }) {
  return (
    <div className='flex w-full flex-col items-start'>
      <p>{label}</p>
      <p className='text-lg font-semibold'>
        {total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
      </p>
      <p className='text-content-tertiary text-xs'>IMPORTE TOTAL</p>
    </div>
  );
}

function Root({ children }: PropsWithChildren) {
  return (
    <Tabs
      aria-label='Tipos de inventarios'
      classNames={{
        tabList: 'h-fit min-h-fit max-h-fit',
        tab: 'h-fit min-h-fit max-h-fit py-2',
        tabContent: 'w-full',
      }}
      fullWidth
    >
      {children}
    </Tabs>
  );
}

const InventoryTabs = Object.assign(Root, {
  TabTitle,
}) as InventoryTabsCompound;

export { InventoryTabs };
