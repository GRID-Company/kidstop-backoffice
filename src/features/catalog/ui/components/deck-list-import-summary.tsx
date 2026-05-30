'use client';

import { Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { IDeckListImportResult } from '../../domain/deck-list-parser.types';

interface DeckListImportSummaryProps {
  result: IDeckListImportResult;
}

export default function DeckListImportSummary({ result }: DeckListImportSummaryProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Chip
        startContent={<Icon icon="lucide:list" className="ml-1" width={14} />}
        variant="flat"
      >
        {result.totalCards} {result.totalCards === 1 ? 'línea' : 'líneas'}
      </Chip>
      <Chip
        startContent={<Icon icon="lucide:hash" className="ml-1" width={14} />}
        variant="flat"
      >
        {result.totalQuantity} {result.totalQuantity === 1 ? 'carta' : 'cartas'} total
      </Chip>
      <Chip
        startContent={<Icon icon="lucide:check-circle" className="ml-1" width={14} />}
        variant="flat"
        color="success"
      >
        {result.foundCount} {result.foundCount === 1 ? 'encontrada' : 'encontradas'}
      </Chip>
      <Chip
        startContent={<Icon icon="lucide:x-circle" className="ml-1" width={14} />}
        variant="flat"
        color="warning"
      >
        {result.missingCount} {result.missingCount === 1 ? 'faltante' : 'faltantes'}
      </Chip>
      {result.invalidCount > 0 && (
        <Chip
          startContent={<Icon icon="lucide:alert-triangle" className="ml-1" width={14} />}
          variant="flat"
          color="danger"
        >
          {result.invalidCount} {result.invalidCount === 1 ? 'inválida' : 'inválidas'}
        </Chip>
      )}
    </div>
  );
}
