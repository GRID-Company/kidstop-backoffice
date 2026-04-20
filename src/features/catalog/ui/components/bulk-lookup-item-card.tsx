'use client';

import { Card, CardBody, Chip, Button, Input, Checkbox } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { IPriceAnalysis } from '../../domain/bulk-lookup.types';
import { CardImage } from '@/shared/components/card-image';

interface BulkLookupItemCardProps {
  item: IPriceAnalysis;
  imageUrl?: string;
  tcgType: 'POKEMON' | 'MAGIC';
  isSelected: boolean;
  onToggleSelection: () => void;
  onPriceChange: (sellPrice: number, purchasePrice: number) => void;
}

export default function BulkLookupItemCard({
  item,
  imageUrl,
  tcgType,
  isSelected,
  onToggleSelection,
  onPriceChange,
}: BulkLookupItemCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [sellPrice, setSellPrice] = useState(item.currentPrice?.toString() || '0');

  const getMarginColor = (margin: number | null) => {
    if (margin === null) return 'default';
    if (margin > 0) return 'success';
    if (margin < 0) return 'danger';
    return 'warning';
  };

  const handleSave = () => {
    const newPrice = parseFloat(sellPrice);
    if (!isNaN(newPrice)) {
      onPriceChange(newPrice, newPrice);
      setEditMode(false);
    }
  };

  return (
    <Card className="w-full">
      <CardBody className="flex flex-row items-center gap-4 p-4">
        {/* Checkbox */}
        <Checkbox
          isSelected={isSelected}
          onChange={onToggleSelection}
          aria-label={`Select ${item.cardName}`}
        />

        {/* Card Image */}
        <div className="shrink-0">
          <CardImage
            src={imageUrl}
            alt={item.cardName}
            tcgType={tcgType}
            containerClassName="relative h-24 w-16 rounded overflow-hidden bg-default-100"
            className="object-cover"
            fill
            sizes="64px"
          />
        </div>

        {/* Card Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm truncate">{item.cardName}</h4>
            <Chip size="sm" variant="flat">
              {item.condition}
            </Chip>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-default-500">Actual</p>
              <p className="font-semibold">${item.currentPrice?.toFixed(2) || '—'}</p>
            </div>
            <div>
              <p className="text-default-500">Mercado</p>
              <p className="font-semibold">${item.marketPrice?.toFixed(2) || '—'}</p>
            </div>
            <div>
              <p className="text-default-500">Margen</p>
              <Chip
                size="sm"
                variant="flat"
                color={getMarginColor(item.marginPercentage)}
                className="mt-1"
              >
                {item.marginPercentage !== null ? `${item.marginPercentage.toFixed(1)}%` : 'N/A'}
              </Chip>
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-2 text-xs text-default-500">
            Stock: <span className="font-semibold text-default-700">{item.quantity}</span>
          </div>
        </div>

        {/* Actions */}
        {editMode ? (
          <div className="flex gap-2 shrink-0">
            <Input
              type="number"
              size="sm"
              value={sellPrice}
              onValueChange={setSellPrice}
              placeholder="Nuevo precio"
              className="w-24"
            />
            <Button
              isIconOnly
              size="sm"
              color="success"
              variant="flat"
              onPress={handleSave}
            >
              <Icon icon="lucide:check" width={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => setEditMode(false)}
            >
              <Icon icon="lucide:x" width={16} />
            </Button>
          </div>
        ) : (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setEditMode(true)}
            className="shrink-0"
          >
            <Icon icon="lucide:edit-2" width={16} />
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
