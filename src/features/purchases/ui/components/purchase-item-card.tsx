'use client';

import { useMemo } from 'react';
import { Button, Tooltip, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useFormContext, useWatch } from 'react-hook-form';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { CardImage } from '@/shared/components/card-image';
import PokemonTypeIcon from '@/shared/components/pokemon-type-icon';
import SelectForm from '@/shared/base/form-controls/select-form';
import InputForm from '@/shared/base/form-controls/input-form';
import { CARD_CONDITION_OPTIONS, CARD_CONDITION_SHORT_LABELS } from '@/lib/types/card.types';
import { usePrivacyModeStore } from '@/lib/store/privacy-mode';
import { REDACTED_VALUE, formatCurrencyWithPrivacy } from '@/lib/utils/privacy.utils';
import { IPurchaseItem } from '../../domain/types';
import { calculateItemSubtotal } from '../../domain/purchases.domain';

interface PurchaseItemCardProps {
  item: IPurchaseItem;
  index: number;
  onRemove?: (itemId: string) => void;
  isReadOnly?: boolean;
}

function PriceMetric({
  label,
  value,
  icon,
  isHighlighted = false,
}: {
  label: string;
  value: number;
  icon: string;
  isHighlighted?: boolean;
}) {
  const { isPrivacyMode } = usePrivacyModeStore();
  const displayValue = formatCurrencyWithPrivacy(value, isPrivacyMode);

  return (
    <div className="flex items-center gap-1.5">
      <Icon icon={icon} width={14} className="text-default-400" />
      <div className="flex flex-col">
        <span className="text-[10px] text-default-400">{label}</span>
        <span className={`text-xs font-medium ${isHighlighted ? 'text-accent' : 'text-default-700'}`}>
          {displayValue}
        </span>
      </div>
    </div>
  );
}

export default function PurchaseItemCard({
  item,
  index,
  onRemove,
  isReadOnly = false,
}: PurchaseItemCardProps) {
  const { control } = useFormContext();
  const { isPrivacyMode } = usePrivacyModeStore();

  const quantity = useWatch({
    control,
    name: `cards.${index}.quantity`,
  });

  const offerPrice = useWatch({
    control,
    name: `cards.${index}.offerPrice`,
  });

  const subtotal = useMemo(() => {
    if (typeof quantity === 'number' && typeof offerPrice === 'number') {
      return quantity * offerPrice;
    }
    return calculateItemSubtotal(item);
  }, [quantity, offerPrice, item]);

  const priceChanged = useMemo(() => {
    if (!item.referencePrice || !item.currentReferencePrice) return false;
    return Math.abs(item.referencePrice - item.currentReferencePrice) > 0.01;
  }, [item.referencePrice, item.currentReferencePrice]);

  const displaySubtotal = formatCurrencyWithPrivacy(subtotal, isPrivacyMode);

  return (
    <KidstopCard className="w-full border-default-200">
      <div className="relative flex flex-col gap-3 p-3 xl:p-4">
        {!isReadOnly && onRemove && (
          <div className="absolute right-2 top-2">
            <Tooltip content="Eliminar item" color="danger">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => onRemove(item.guid)}
                aria-label={`Eliminar ${item.cardName}`}
              >
                <Icon icon="lucide:trash-2" width={16} />
              </Button>
            </Tooltip>
          </div>
        )}

        <div className="flex gap-3">
          <CardImage
            src={item.cardImageUrl}
            alt={item.cardName}
            tcgType={item.tcgType}
            containerClassName="relative h-[120px] w-[87px] rounded-md overflow-hidden bg-default-100 flex-shrink-0"
            className="object-contain"
            fill
            sizes="87px"
          />

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <h4 className="text-sm font-semibold leading-tight text-default-900">
                {item.cardName}
              </h4>
              {item.tcgType === 'POKEMON' && (item.type || item.hp || item.variant) && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.type && (
                    <div className="flex items-center gap-0.5">
                      <PokemonTypeIcon type={item.type} size="sm" />
                      <span className="text-[10px] text-default-600">{item.type}</span>
                    </div>
                  )}
                  {item.hp && (
                    <Chip size="sm" variant="flat" className="h-4 px-1.5 text-[10px]">
                      {item.hp} HP
                    </Chip>
                  )}
                  {item.variant && !item.variant.toLowerCase().includes('normal') && (
                    <Chip size="sm" variant="flat" color="secondary" className="h-4 px-1.5 text-[10px]">
                      {item.variant}
                    </Chip>
                  )}
                </div>
              )}
              <p className="text-xs text-default-500">
                {item.setName} · {item.setCode}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {item.referencePrice && item.referencePrice > 0 && (
                <PriceMetric
                  label="Ref. al agregar"
                  value={item.referencePrice}
                  icon="lucide:tag"
                />
              )}
              
              {item.currentReferencePrice && item.currentReferencePrice > 0 && (
                <div className="relative">
                  <PriceMetric
                    label="Ref. actual"
                    value={item.currentReferencePrice}
                    icon="lucide:trending-up"
                    isHighlighted={priceChanged}
                  />
                  {priceChanged && (
                    <div className="absolute -right-1 -top-1">
                      <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                    </div>
                  )}
                </div>
              )}

              {item.metrics?.currentStock !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Icon
                    icon="lucide:package"
                    width={14}
                    className={item.metrics.currentStock > 0 ? 'text-success' : 'text-danger'}
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-default-400">Stock</span>
                    <span className="text-xs font-medium text-default-700">
                      {item.metrics.currentStock}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-default-200 pt-3">
          {isReadOnly ? (
            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-default-500">Condición</span>
                <span className="text-sm font-medium">
                  {CARD_CONDITION_SHORT_LABELS[item.condition]}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-default-500">Cantidad</span>
                <span className="text-sm font-medium">{item.quantity}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-default-500">Precio oferta</span>
                <span className="text-sm font-medium">
                  {formatCurrencyWithPrivacy(item.offerPrice, isPrivacyMode)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-default-500">Subtotal</span>
                <span className="text-sm font-semibold text-accent">
                  {displaySubtotal}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <SelectForm
                controlProps={{
                  name: `cards.${index}.condition`,
                  control,
                }}
                label="Condición"
                size="sm"
                variant="bordered"
                classNames={{
                  trigger: 'border-[1px] bg-white',
                  label: 'text-xs',
                }}
                aria-label="Condición de la carta"
                items={CARD_CONDITION_OPTIONS}
              />

              <InputForm
                controlProps={{
                  name: `cards.${index}.quantity`,
                  control,
                }}
                type="number"
                size="sm"
                variant="bordered"
                label="Cantidad"
                min={1}
                classNames={{
                  inputWrapper: 'border-[1px] bg-white',
                  input: 'text-center',
                  label: 'text-xs',
                }}
                aria-label="Cantidad de cartas"
              />

              <InputForm
                controlProps={{
                  name: `cards.${index}.offerPrice`,
                  control,
                }}
                type="number"
                size="sm"
                variant="bordered"
                label="Precio oferta"
                min={0}
                step={0.01}
                startContent={<span className="text-xs text-default-400">$</span>}
                classNames={{
                  inputWrapper: 'border-[1px] bg-white',
                  input: 'text-right',
                  label: 'text-xs',
                }}
                aria-label="Precio oferta"
              />

              <div className="flex flex-col justify-end gap-1">
                <span className="text-xs text-default-500">Subtotal</span>
                <span className="text-lg font-semibold text-accent">
                  {displaySubtotal}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </KidstopCard>
  );
}
