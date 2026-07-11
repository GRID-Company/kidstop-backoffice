'use client';

import { forwardRef, useRef, useImperativeHandle } from 'react';
import { useWatch } from 'react-hook-form';
import { Skeleton } from '@heroui/react';
import { Icon } from '@iconify/react';
import BulkCardResultCard from './bulk-card-result-card';
import {
  BulkCardSearchResultsProps,
  BulkCardSearchResultsHandle,
} from './types';
import { getValidCardFormIndex } from './utils';

const BulkCardSearchResults = forwardRef<
  BulkCardSearchResultsHandle,
  BulkCardSearchResultsProps
>(function BulkCardSearchResults(
  { results, variant, tcgType, isLoading, onRemove },
  ref
) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsData = useWatch({ name: 'cards' });

  useImperativeHandle(
    ref,
    () => ({
      scrollToFirstUnconfigured: () => {
        if (!cardsData || !Array.isArray(cardsData)) return;

        let formFieldIndex = 0;
        for (let i = 0; i < results.length; i++) {
          const result = results[i];

          if (result.error || !result.bestMatch) {
            continue;
          }

          const card = cardsData[formFieldIndex];
          const isConfigured =
            card &&
            !!card.selectedCardGuid &&
            !!card.condition &&
            typeof card.quantity === 'number' &&
            card.quantity > 0 &&
            !isNaN(card.quantity) &&
            ((variant === 'purchases' &&
              typeof card.offerPrice === 'number' &&
              card.offerPrice >= 0 &&
              !isNaN(card.offerPrice)) ||
              (variant === 'inventory' &&
                typeof card.publicPrice === 'number' &&
                card.publicPrice >= 0 &&
                !isNaN(card.publicPrice)));

          if (!isConfigured && cardRefs.current[i]) {
            cardRefs.current[i]?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            return;
          }

          formFieldIndex++;
        }
      },
    }),
    [results, cardsData, variant]
  );

  if (isLoading) {
    return (
      <div className='flex flex-col gap-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='border-default-200 flex gap-3 rounded-xl border p-3 xl:p-4'
          >
            <Skeleton className='h-[90px] w-[65px] shrink-0 rounded-md' />
            <div className='flex flex-1 flex-col justify-center gap-2'>
              <Skeleton className='h-4 w-2/3 rounded-md' />
              <Skeleton className='h-3 w-1/2 rounded-md' />
              <div className='flex gap-4 pt-1'>
                <Skeleton className='h-3 w-16 rounded-md' />
                <Skeleton className='h-3 w-16 rounded-md' />
                <Skeleton className='h-3 w-16 rounded-md' />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className='text-default-400 flex flex-col items-center justify-center py-12'>
        <Icon icon='lucide:inbox' width={40} className='mb-2' />
        <span className='text-sm'>
          Ingresa una lista de cartas y presiona "Buscar cartas"
        </span>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {results.map((result, resultIndex) => {
        const formFieldIndex = getValidCardFormIndex(results, resultIndex);

        return (
          <BulkCardResultCard
            key={`${result.originalLine}-${resultIndex}`}
            ref={(el) => {
              cardRefs.current[resultIndex] = el;
            }}
            result={result}
            index={formFieldIndex}
            variant={variant}
            tcgType={tcgType}
            onRemove={onRemove ? () => onRemove(resultIndex) : undefined}
          />
        );
      })}
    </div>
  );
});

export default BulkCardSearchResults;
