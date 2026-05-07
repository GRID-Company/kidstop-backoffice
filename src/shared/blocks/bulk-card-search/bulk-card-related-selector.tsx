'use client';

import { RadioGroup, Radio, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import PokemonTypeIcon from '@/shared/components/pokemon-type-icon';
import { BulkCardRelatedSelectorProps } from './types';
import pokemonCardPlaceholder from '@/assets/img/pokemon-card-placeholder.png';
import magicCardPlaceholder from '@/assets/img/magic-card-placeholder.png';

export default function BulkCardRelatedSelector({
  relatedCards,
  selectedCardGuid,
  onSelect,
  tcgType,
}: BulkCardRelatedSelectorProps) {
  if (relatedCards.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-default-600">Cartas relacionadas:</p>
      <RadioGroup
        value={selectedCardGuid}
        onValueChange={onSelect}
        orientation="horizontal"
        classNames={{
          wrapper: 'gap-2',
        }}
      >
        {relatedCards.map((card) => (
          <Radio
            key={card.guid}
            value={card.guid}
            classNames={{
              base: 'inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent data-[selected=true]:border-primary',
              wrapper: 'hidden',
            }}
          >
            <div className="flex items-center gap-2">
              <div className="relative h-[60px] w-[43px] shrink-0 overflow-hidden rounded-md bg-default-100">
                {card.imageUri ? (
                  <img
                    src={card.imageUri}
                    alt={card.name}
                    className="absolute inset-0 h-full w-full object-contain p-0.5"
                  />
                ) : (
                  <Image
                    src={tcgType === 'MAGIC' ? magicCardPlaceholder : pokemonCardPlaceholder}
                    alt={`${tcgType} card placeholder`}
                    fill
                    sizes="43px"
                    className="object-contain p-0.5"
                  />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-semibold leading-tight line-clamp-2">{card.name}</p>
                <div className="flex flex-wrap items-center gap-1">
                  {tcgType === 'POKEMON' && card.type && (
                    <PokemonTypeIcon type={card.type} size="sm" />
                  )}
                  {card.variant && !card.variant.toLowerCase().includes('normal') && (
                    <span className="text-[9px] text-default-400">{card.variant}</span>
                  )}
                </div>
                <p className="text-[10px] text-default-500">
                  {card.edition} · {card.collectorNumber}
                </p>
                <div className="flex items-center gap-1">
                  <Icon
                    icon="lucide:package"
                    width={10}
                    className={card.totalStock > 0 ? 'text-success' : 'text-danger'}
                  />
                  <span className="text-[10px] text-default-400">
                    {card.totalStock > 0 ? `${card.totalStock} en stock` : 'Sin stock'}
                  </span>
                </div>
              </div>
            </div>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
