import { forwardRef, useRef, useImperativeHandle } from 'react';
import { Icon } from '@iconify/react';
import PriceAdjustmentItem from './price-adjustment-item';
import {
  PriceAdjustmentItemsListProps,
  PriceAdjustmentItemsListHandle,
} from './price-adjustment-types';

const PriceAdjustmentItemsList = forwardRef<
  PriceAdjustmentItemsListHandle,
  PriceAdjustmentItemsListProps
>(function PriceAdjustmentItemsList(
  { items, control, displayCurrency, itemsWithoutPrice, autoCalculatedItems },
  ref
) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    scrollToFirstInvalid: () => {
      const firstInvalidIndex = items.findIndex((item) =>
        itemsWithoutPrice.includes(item.guid)
      );

      if (firstInvalidIndex !== -1 && itemRefs.current[firstInvalidIndex]) {
        itemRefs.current[firstInvalidIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    },
  }));

  if (items.length === 0) {
    return (
      <div className='text-default-400 flex flex-col items-center justify-center py-6'>
        <Icon icon='lucide:package-open' width={36} className='mb-2' />
        <span className='text-sm'>No hay items para ajustar</span>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {items.map((item, index) => {
        const hasError = itemsWithoutPrice.includes(item.guid);

        return (
          <PriceAdjustmentItem
            key={item.guid}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            item={item}
            index={index}
            control={control}
            displayCurrency={displayCurrency}
            hasError={hasError}
            autoCalculatedItems={autoCalculatedItems}
          />
        );
      })}
    </div>
  );
});

export default PriceAdjustmentItemsList;
