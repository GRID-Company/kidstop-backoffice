'use client';

import { useCallback, useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

import {
  generatePickingListPdf,
  PickingListData,
} from '@/lib/utils/pdf-generator';
import { CARD_CONDITION_SHORT_LABELS } from '@/lib/types/card.types';
import { ISale, ISaleItem } from '../../domain/types';
import {
  getCustomerDisplayEmail,
  getCustomerDisplayName,
} from '../../adapters/mappers/sale.mapper';

interface GeneratePdfButtonProps {
  sale: ISale;
}

function mapItemForPdf(item: ISaleItem) {
  const cardName =
    item.pokemonCardSummary?.name ?? item.magicCardSummary?.name ?? '—';
  const cardImageUrl =
    item.pokemonCardSummary?.imageUri ?? item.magicCardSummary?.imageUri ?? undefined;
  const setName =
    item.pokemonCardSummary?.setName ?? item.magicCardSummary?.edition ?? '—';
  const setCode =
    item.pokemonCardSummary?.setCode ?? item.magicCardSummary?.collectorNumber ?? '—';
  return {
    cardName,
    cardImageUrl: cardImageUrl ?? undefined,
    setName: setName ?? '—',
    setCode: setCode ?? '—',
    condition: CARD_CONDITION_SHORT_LABELS[item.condition],
    quantity: item.quantity,
    unitPrice: item.price,
  };
}

export default function GeneratePdfButton({ sale }: GeneratePdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const data: PickingListData = {
        code: sale.saleCode,
        customerName: getCustomerDisplayName(
          sale.customer?.name,
          sale.kioskCustomerName
        ),
        customerEmail:
          getCustomerDisplayEmail(
            sale.customer?.emailAddress,
            sale.kioskCustomerEmail
          ) ?? '',
        tcgType: sale.tcg,
        createdAt: sale.createdDate,
        notes: sale.notes ?? undefined,
        items: sale.items.map(mapItemForPdf),
      };
      await generatePickingListPdf(data);
    } finally {
      setIsGenerating(false);
    }
  }, [sale]);

  return (
    <Tooltip content="Descargar picking list en PDF">
      <Button
        variant="bordered"
        className="border-accent text-accent"
        startContent={<Icon icon="lucide:file-down" width={18} />}
        isLoading={isGenerating}
        onPress={handleGenerate}
      >
        Picking List PDF
      </Button>
    </Tooltip>
  );
}
