'use client';

import { useState, useMemo, useCallback } from 'react';
import { Accordion, AccordionItem, Badge, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useFormContext, useWatch } from 'react-hook-form';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import BulkCardRelatedSelector from './bulk-card-related-selector';
import BulkCardFormControls from './bulk-card-form-controls';
import { BulkCardResultCardProps } from './types';
import { formatCurrency } from '@/lib/utils/format-currency';

function MetricItem({
  icon,
  label,
  value,
  valueClassName = '',
}: {
  icon: string;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1">
        <Icon icon={icon} width={12} className="text-default-400" />
        <span className="text-[10px] text-default-400">{label}</span>
      </div>
      <span className={`text-xs ${valueClassName}`}>{value}</span>
    </div>
  );
}

export default function BulkCardResultCard({
  result,
  index,
  variant,
  tcgType,
}: BulkCardResultCardProps) {
  const { setValue } = useFormContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedCardGuid = useWatch({
    name: `cards.${index}.selectedCardGuid`,
  });

  const quantity = useWatch({
    name: `cards.${index}.quantity`,
  });

  const condition = useWatch({
    name: `cards.${index}.condition`,
  });

  const price = useWatch({
    name: variant === 'purchases' ? `cards.${index}.offerPrice` : `cards.${index}.publicPrice`,
  });

  const selectedCard = useMemo(() => {
    if (selectedCardGuid === result.bestMatch?.guid) {
      return result.bestMatch;
    }
    return result.relatedCards.find((c) => c.guid === selectedCardGuid) || result.bestMatch;
  }, [selectedCardGuid, result.bestMatch, result.relatedCards]);

  const isConfigured = useMemo(() => {
    return (
      selectedCardGuid &&
      condition &&
      typeof quantity === 'number' &&
      quantity > 0 &&
      typeof price === 'number' &&
      price >= 0
    );
  }, [selectedCardGuid, condition, quantity, price]);

  const handleSelectRelatedCard = useCallback(
    (cardGuid: string) => {
      setValue(`cards.${index}.selectedCardGuid`, cardGuid);
    },
    [setValue, index]
  );

  if (result.error) {
    return (
      <KidstopCard className="w-full border-danger">
        <CardBody className="flex flex-row items-center gap-3 !p-3">
          <Icon icon="lucide:alert-circle" width={24} className="text-danger" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-danger">Error al procesar</p>
            <p className="text-xs text-default-500">{result.originalLine}</p>
            <p className="text-xs text-danger">{result.error}</p>
          </div>
        </CardBody>
      </KidstopCard>
    );
  }

  if (!selectedCard) {
    return (
      <KidstopCard className="w-full border-warning">
        <CardBody className="flex flex-row items-center gap-3 !p-3">
          <Icon icon="lucide:search-x" width={24} className="text-warning" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning">No se encontró coincidencia</p>
            <p className="text-xs text-default-500">{result.originalLine}</p>
          </div>
        </CardBody>
      </KidstopCard>
    );
  }

  return (
    <KidstopCard className={`w-full ${isConfigured ? 'border-2 border-accent' : ''}`}>
      <Accordion
        variant="light"
        selectedKeys={isExpanded ? ['content'] : []}
        onSelectionChange={(keys) => {
          setIsExpanded(Array.from(keys).includes('content'));
        }}
      >
        <AccordionItem
          key="content"
          aria-label={selectedCard.name}
          title={
            <div className="flex items-center gap-3 py-1">
              <div className="relative h-[90px] w-[65px] shrink-0 overflow-hidden rounded-md bg-default-100">
                {selectedCard.imageUri ? (
                  <img
                    src={selectedCard.imageUri}
                    alt={selectedCard.name}
                    className="absolute inset-0 h-full w-full object-contain p-1"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-default-400">
                    <Icon icon="lucide:image-off" width={24} />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight">{selectedCard.name}</p>
                  {isConfigured && (
                    <Badge color="success" size="sm" variant="flat">
                      Configurado
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-default-500">
                  {selectedCard.edition} · #{selectedCard.collectorNumber}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Icon
                      icon="lucide:package"
                      width={12}
                      className={selectedCard.totalStock > 0 ? 'text-success' : 'text-danger'}
                    />
                    <span className="text-xs text-default-500">
                      {selectedCard.totalStock > 0
                        ? `${selectedCard.totalStock} en stock`
                        : 'Sin stock'}
                    </span>
                  </div>
                  {selectedCard.sellPrice && (
                    <div className="flex items-center gap-1">
                      <Icon icon="lucide:tag" width={12} className="text-default-400" />
                      <span className="text-xs font-semibold text-accent">
                        {formatCurrency(selectedCard.sellPrice)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-4 px-2 pb-3">
            {result.relatedCards.length > 0 && (
              <BulkCardRelatedSelector
                relatedCards={result.relatedCards}
                selectedCardGuid={selectedCardGuid}
                onSelect={handleSelectRelatedCard}
              />
            )}

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-default-600">Configuración:</p>
              <BulkCardFormControls variant={variant} index={index} selectedCard={selectedCard} />
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </KidstopCard>
  );
}
