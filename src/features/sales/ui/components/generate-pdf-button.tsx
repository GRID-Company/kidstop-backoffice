'use client';

import { useCallback, useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

import {
  generatePickingListPdf,
  PickingListData,
} from '@/lib/utils/pdf-generator';
import { CARD_CONDITION_SHORT_LABELS } from '@/lib/types/card.types';
import { ISale } from '../../domain/types';

interface GeneratePdfButtonProps {
  sale: ISale;
}

export default function GeneratePdfButton({ sale }: GeneratePdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    try {
      const data: PickingListData = {
        code: sale.code,
        customerName: sale.customerName,
        customerEmail: sale.customerEmail,
        tcgType: sale.tcgType,
        createdAt: sale.createdAt,
        notes: sale.notes,
        items: sale.items.map((item) => ({
          cardName: item.cardName,
          setName: item.setName,
          setCode: item.setCode,
          condition: CARD_CONDITION_SHORT_LABELS[item.condition],
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };
      generatePickingListPdf(data);
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
