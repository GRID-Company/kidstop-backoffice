'use client';

import Image from 'next/image';
import { Card, CardBody, CardFooter, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { IMagicCard } from '../../domain/types';

interface MagicCardGridItemProps {
  card: IMagicCard;
  onPress: (card: IMagicCard) => void;
}

export default function MagicCardGridItem({ card, onPress }: MagicCardGridItemProps) {
  const hasStock = card.totalStock > 0;

  return (
    <Card
      isPressable
      onPress={() => onPress(card)}
      className="group relative overflow-hidden transition-all hover:scale-[1.02]"
    >
      <CardBody className="p-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-default-100">
          {card.imageUri ? (
            <Image
              src={card.imageUri}
              alt={card.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-default-400">
              <span className="text-6xl">🃏</span>
            </div>
          )}

          {card.isFoil && (
            <div className="absolute right-2 top-2">
              <Chip
                size="sm"
                variant="flat"
                startContent={<Icon icon="lucide:sparkles" className="text-sm" />}
                classNames={{
                  base: 'bg-gradient-to-r from-yellow-400/90 to-amber-500/90',
                  content: 'text-white font-semibold',
                }}
              >
                Foil
              </Chip>
            </div>
          )}

          {!hasStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Chip color="danger" variant="flat" size="sm">
                Sin stock
              </Chip>
            </div>
          )}
        </div>
      </CardBody>

      <CardFooter className="flex flex-col items-start gap-2 p-3">
        <div className="flex w-full items-start justify-between gap-2">
          <h4 className="line-clamp-2 text-sm font-semibold text-foreground">
            {card.name}
          </h4>
          {card.sellPrice !== null && (
            <span className="shrink-0 text-sm font-bold text-accent">
              ${card.sellPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex w-full flex-wrap items-center gap-1 text-xs text-default-500">
          {card.edition && <span>{card.edition}</span>}
          {card.collectorNumber && (
            <>
              <span>·</span>
              <span>#{card.collectorNumber}</span>
            </>
          )}
        </div>

        <div className="flex w-full items-center justify-between text-xs">
          <span className="text-default-500">
            Stock: <span className="font-semibold text-foreground">{card.totalStock}</span>
          </span>
          {card.variants.length > 0 && (
            <span className="text-default-400">{card.variants.length} variantes</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
