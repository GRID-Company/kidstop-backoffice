'use client';

import Image from 'next/image';
import { Chip, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';

import { IMostWantedCard } from '../../domain/types';
import { MOST_WANTED_PRIORITY_LABELS } from '../../domain/constants';

interface MostWantedPreviewProps {
  items: IMostWantedCard[];
}

const PRIORITY_BADGE: Record<string, string> = {
  HIGH: 'bg-danger text-white',
  MEDIUM: 'bg-warning text-white',
  LOW: 'bg-default-300 text-default-700',
};

function PreviewCardItem({
  item,
  rank,
}: {
  item: IMostWantedCard;
  rank: number;
}) {
  const badgeClass = PRIORITY_BADGE[item.priority] ?? PRIORITY_BADGE.LOW;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-default-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-content1">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
        {rank}
      </span>

      <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-lg bg-default-100">
        {item.card.imageUrl ? (
          <Image
            src={item.card.imageUrl}
            alt={item.card.name}
            fill
            sizes="64px"
            className="object-contain p-0.5"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-default-400">
            <Icon icon="lucide:image" width={20} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-sm font-semibold">{item.card.name}</span>
        <span className="truncate text-xs text-default-500">
          {item.card.setName} · #{item.card.number}
        </span>
        <div className="flex items-center gap-2">
          <Chip size="sm" variant="flat" classNames={{ base: 'bg-accent/10', content: 'text-accent text-[10px] font-medium' }}>
            {item.card.rarity}
          </Chip>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeClass}`}>
            {MOST_WANTED_PRIORITY_LABELS[item.priority]}
          </span>
        </div>
        {item.notes && (
          <span className="truncate text-[11px] italic text-default-400">
            {item.notes}
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-default-400">
      <Icon icon="lucide:eye-off" width={36} />
      <p className="text-sm font-medium">Sin cartas activas para mostrar</p>
      <p className="text-xs">Activa cartas en la lista para verlas en el preview</p>
    </div>
  );
}

export default function MostWantedPreview({ items }: MostWantedPreviewProps) {
  const activeItems = items.filter((item) => item.isActive);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-default-200 bg-default-50 p-5">
      <div className="flex items-center gap-2">
        <Icon icon="lucide:eye" width={18} className="text-accent" />
        <span className="text-sm font-semibold text-accent">
          Vista previa pública
        </span>
        <span className="ml-auto text-xs text-default-400">
          {activeItems.length} {activeItems.length === 1 ? 'carta' : 'cartas'}
        </span>
      </div>

      <Divider />

      <div className="rounded-xl border border-dashed border-default-300 bg-white p-4 dark:bg-content1">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-bold text-accent">Most Wanted</h3>
          <p className="text-xs text-default-500">
            Estamos buscando estas cartas — ¡Tráelas y te las compramos!
          </p>
        </div>

        {activeItems.length === 0 ? (
          <EmptyPreview />
        ) : (
          <div className="flex flex-col gap-3">
            {activeItems.map((item, index) => (
              <PreviewCardItem key={item.id} item={item} rank={index + 1} />
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-[10px] text-default-400">
        Esta es una simulación de cómo se verá la página pública
      </p>
    </div>
  );
}
