'use client';

import Image from 'next/image';
import { CardBody, Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { IPokemonCard, CardCondition } from '../../domain/types';
import { CARD_CONDITION_SHORT_LABELS } from '../../domain/constants';

interface PokemonCardGridItemProps {
  card: IPokemonCard;
  onPress?: (card: IPokemonCard) => void;
}

export default function PokemonCardGridItem({ card, onPress }: PokemonCardGridItemProps) {
  const lowestSellPrice =
    card.variants.length > 0
      ? Math.min(...card.variants.map((v) => v.sellPrice ?? 0))
      : card.sellPrice ?? 0;

  return (
    <KidstopCard
      isPressable={!!onPress}
      onPress={() => onPress?.(card)}
      className="h-full"
    >
      <CardBody className="flex flex-col gap-3 !p-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-md bg-default-100">
          {card.imageUri ? (
            <Image
              src={card.imageUri}
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
          {onPress && (
            <Tooltip content="Ver detalle" placement="top" delay={100}>
              <Button
                isIconOnly
                size="sm"
                variant="solid"
                className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white"
                onPress={() => onPress(card)}
              >
                <Icon icon="lucide:eye" className="text-default-700" />
              </Button>
            </Tooltip>
          )}
        </div>

        <div className="flex flex-col gap-1.5 px-4 pb-4">
          <p className="truncate text-sm font-semibold">{card.name}</p>

          <p className="truncate text-xs text-default-500">
            {card.setName} {card.setCode ? `· ${card.setCode}` : ''}
          </p>

          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm font-bold text-success">
              ${lowestSellPrice.toFixed(2)}
            </span>
            <span className="text-xs text-default-500">
              Stock: {card.totalStock}
            </span>
          </div>

          {card.variants.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {card.variants.map((v, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-default-100 px-2 py-0.5 text-[10px] text-default-600"
                >
                  {CARD_CONDITION_SHORT_LABELS[v.condition as CardCondition] ?? v.condition} ({v.stock})
                </span>
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </KidstopCard>
  );
}
