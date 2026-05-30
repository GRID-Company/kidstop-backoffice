'use client';

import { Skeleton } from '@heroui/react';
import { Icon } from '@iconify/react';
import BulkCardResultCard from './bulk-card-result-card';
import { BulkCardSearchResultsProps } from './types';

export default function BulkCardSearchResults({
  results,
  variant,
  tcgType,
  isLoading,
}: BulkCardSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-default-200 p-3 xl:p-4"
          >
            <Skeleton className="h-[90px] w-[65px] shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col justify-center gap-2">
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
              <div className="flex gap-4 pt-1">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-default-400">
        <Icon icon="lucide:inbox" width={40} className="mb-2" />
        <span className="text-sm">
          Ingresa una lista de cartas y presiona "Buscar cartas"
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {results.map((result, index) => (
        <BulkCardResultCard
          key={`${result.originalLine}-${index}`}
          result={result}
          index={index}
          variant={variant}
          tcgType={tcgType}
        />
      ))}
    </div>
  );
}
