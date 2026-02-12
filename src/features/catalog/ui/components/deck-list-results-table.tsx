'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Chip,
  Pagination,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  CardBody,
  Button,
  Tab,
  Tabs,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { KidstopTable } from '@/shared/base/heorui-overrides/table';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { IDeckListResolvedLine } from '../../domain/deck-list-parser.types';

interface DeckListResultsTableProps {
  lines: IDeckListResolvedLine[];
  onAddToPurchase?: (line: IDeckListResolvedLine) => void;
  onViewDetail?: (line: IDeckListResolvedLine) => void;
}

const PAGE_SIZE = 10;

type FilterTab = 'all' | 'found' | 'missing' | 'invalid';

const COLUMNS = [
  { key: 'lineNumber', label: '#' },
  { key: 'quantity', label: 'Cant.' },
  { key: 'cardName', label: 'Carta' },
  { key: 'setCode', label: 'Set' },
  { key: 'collectorNumber', label: 'Núm.' },
  { key: 'status', label: 'Estado' },
  { key: 'stock', label: 'Stock' },
  { key: 'price', label: 'Precio' },
  { key: 'actions', label: '' },
];

function getStatusChip(line: IDeckListResolvedLine) {
  if (!line.isValid) {
    return (
      <Chip size="sm" variant="flat" color="danger" startContent={<Icon icon="lucide:alert-triangle" className="ml-1" width={12} />}>
        Inválida
      </Chip>
    );
  }
  if (line.found) {
    return (
      <Chip size="sm" variant="flat" color="success" startContent={<Icon icon="lucide:check-circle" className="ml-1" width={12} />}>
        Encontrada
      </Chip>
    );
  }
  return (
    <Chip size="sm" variant="flat" color="warning" startContent={<Icon icon="lucide:x-circle" className="ml-1" width={12} />}>
      No encontrada
    </Chip>
  );
}

function renderCell(
  line: IDeckListResolvedLine,
  columnKey: string,
  onAddToPurchase?: (line: IDeckListResolvedLine) => void,
  onViewDetail?: (line: IDeckListResolvedLine) => void
) {
  switch (columnKey) {
    case 'lineNumber':
      return <span className="text-xs text-default-400">{line.lineNumber}</span>;
    case 'quantity':
      return <span className="text-sm font-semibold">{line.isValid ? line.quantity : '—'}</span>;
    case 'cardName':
      return (
        <div className="flex items-center gap-3">
          {line.card?.imageUrl && (
            <div className="relative h-10 w-8 flex-shrink-0 overflow-hidden rounded bg-default-100">
              <Image
                src={line.card.imageUrl}
                alt={line.cardName}
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{line.cardName || line.raw}</p>
            {line.error && (
              <p className="truncate text-xs text-danger">{line.error}</p>
            )}
          </div>
        </div>
      );
    case 'setCode':
      return <span className="text-sm">{line.setCode || '—'}</span>;
    case 'collectorNumber':
      return <span className="text-sm">{line.collectorNumber || '—'}</span>;
    case 'status':
      return getStatusChip(line);
    case 'stock': {
      if (!line.card) return <span className="text-sm text-default-400">—</span>;
      const totalStock = line.card.variants.reduce((sum, v) => sum + v.stock, 0);
      return <span className="text-sm">{totalStock}</span>;
    }
    case 'price': {
      if (!line.card) return <span className="text-sm text-default-400">—</span>;
      const lowestPrice = Math.min(...line.card.variants.map((v) => v.sellPrice));
      return <span className="text-sm font-semibold text-success">${lowestPrice.toFixed(2)}</span>;
    }
    case 'actions':
      if (!line.found) return null;
      return (
        <div className="flex gap-1">
          {onViewDetail && (
            <Button
              variant="light"
              size="sm"
              isIconOnly
              onPress={() => onViewDetail(line)}
              aria-label="Ver detalle"
            >
              <Icon icon="lucide:eye" width={16} />
            </Button>
          )}
          {onAddToPurchase && (
            <Button
              variant="light"
              size="sm"
              isIconOnly
              color="primary"
              onPress={() => onAddToPurchase(line)}
              aria-label="Agregar a compra"
            >
              <Icon icon="lucide:shopping-cart" width={16} />
            </Button>
          )}
        </div>
      );
    default:
      return null;
  }
}

function MobileResultCard({
  line,
  onAddToPurchase,
  onViewDetail,
}: {
  line: IDeckListResolvedLine;
  onAddToPurchase?: (line: IDeckListResolvedLine) => void;
  onViewDetail?: (line: IDeckListResolvedLine) => void;
}) {
  const totalStock = line.card?.variants.reduce((sum, v) => sum + v.stock, 0) ?? 0;
  const lowestPrice = line.card
    ? Math.min(...line.card.variants.map((v) => v.sellPrice))
    : 0;

  return (
    <KidstopCard>
      <CardBody className="flex flex-row gap-3 !p-4">
        {line.card?.imageUrl && (
          <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-default-100">
            <Image
              src={line.card.imageUrl}
              alt={line.cardName}
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold">
              {line.quantity}x {line.cardName || line.raw}
            </p>
            {line.card && (
              <span className="flex-shrink-0 text-sm font-bold text-success">
                ${lowestPrice.toFixed(2)}
              </span>
            )}
          </div>

          {line.isValid && (
            <p className="text-xs text-default-500">
              ({line.setCode}) #{line.collectorNumber}
            </p>
          )}

          {line.error && (
            <p className="text-xs text-danger">{line.error}</p>
          )}

          <div className="flex items-center gap-2">
            {getStatusChip(line)}
            {line.card && (
              <span className="text-xs text-default-400">Stock: {totalStock}</span>
            )}
          </div>

          {line.found && (
            <div className="mt-1 flex gap-1">
              {onViewDetail && (
                <Button variant="light" size="sm" isIconOnly onPress={() => onViewDetail(line)}>
                  <Icon icon="lucide:eye" width={14} />
                </Button>
              )}
              {onAddToPurchase && (
                <Button variant="light" size="sm" isIconOnly color="primary" onPress={() => onAddToPurchase(line)}>
                  <Icon icon="lucide:shopping-cart" width={14} />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardBody>
    </KidstopCard>
  );
}

export default function DeckListResultsTable({
  lines,
  onAddToPurchase,
  onViewDetail,
}: DeckListResultsTableProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [page, setPage] = useState(1);

  const filteredLines = useMemo(() => {
    switch (activeTab) {
      case 'found':
        return lines.filter((l) => l.isValid && l.found);
      case 'missing':
        return lines.filter((l) => l.isValid && !l.found);
      case 'invalid':
        return lines.filter((l) => !l.isValid);
      default:
        return lines;
    }
  }, [lines, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredLines.length / PAGE_SIZE));
  const paginatedLines = filteredLines.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const foundCount = lines.filter((l) => l.isValid && l.found).length;
  const missingCount = lines.filter((l) => l.isValid && !l.found).length;
  const invalidCount = lines.filter((l) => !l.isValid).length;

  const handleTabChange = (key: React.Key) => {
    setActiveTab(key as FilterTab);
    setPage(1);
  };

  if (lines.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={handleTabChange}
        variant="underlined"
        color="primary"
        aria-label="Filtrar resultados"
      >
        <Tab key="all" title={`Todas (${lines.length})`} />
        <Tab key="found" title={`Encontradas (${foundCount})`} />
        <Tab key="missing" title={`Faltantes (${missingCount})`} />
        {invalidCount > 0 && (
          <Tab key="invalid" title={`Inválidas (${invalidCount})`} />
        )}
      </Tabs>

      <div className="hidden lg:block">
        <KidstopTable aria-label="Resultados de importación">
          <TableHeader columns={COLUMNS}>
            {(column) => (
              <TableColumn key={column.key} className="text-center">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={paginatedLines}>
            {(line) => (
              <TableRow key={`${line.lineNumber}-${line.raw}`}>
                {COLUMNS.map((col) => (
                  <TableCell key={col.key} className="text-center">
                    {renderCell(line, col.key, onAddToPurchase, onViewDetail)}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </KidstopTable>
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {paginatedLines.map((line) => (
          <MobileResultCard
            key={`${line.lineNumber}-${line.raw}`}
            line={line}
            onAddToPurchase={onAddToPurchase}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-default-400">
            Mostrando {paginatedLines.length} de {filteredLines.length}
          </p>
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
            size="sm"
          />
        </div>
      )}
    </div>
  );
}
