'use client';

import Image from 'next/image';
import { CardBody } from '@heroui/react';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { ICard } from '../../domain/types';
import { CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';

interface CardGridItemProps {
  card: ICard;
  onPress?: (card: ICard) => void;
}

export default function CardGridItem({ card, onPress }: CardGridItemProps) {
  const totalStock = card.variants.reduce((sum, v) => sum + v.stock, 0);
  const lowestSellPrice = Math.min(...card.variants.map((v) => v.sellPrice));

  return (
    <KidstopCard
      isPressable={!!onPress}
      onPress={() => onPress?.(card)}
      className="h-full"
    >
      <CardBody className="flex flex-col gap-3 !p-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-md bg-default-100">
          {card.imageUrl ? (
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-default-400">
              <span className="text-4xl">🃏</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 px-4 pb-4">
          <p className="truncate text-sm font-semibold">{card.name}</p>

          <p className="truncate text-xs text-default-500">
            {card.setName} · {card.setCode} · #{card.number}
          </p>

          <p className="text-xs text-default-400">{card.rarity}</p>

          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm font-bold text-success">
              ${lowestSellPrice.toFixed(2)}
            </span>
            <span className="text-xs text-default-500">
              Stock: {totalStock}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap gap-1">
            {card.variants.map((v) => (
              <span
                key={v.id}
                className="rounded-full bg-default-100 px-2 py-0.5 text-[10px] text-default-600"
              >
                {CARD_CONDITION_SHORT_LABELS[v.condition]} ({v.stock})
              </span>
            ))}
          </div>
        </div>
      </CardBody>
    </KidstopCard>
  );
}
