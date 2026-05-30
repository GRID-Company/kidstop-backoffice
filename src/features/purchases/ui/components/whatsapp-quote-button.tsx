'use client';

import { useMemo, useCallback } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

import { TCGType } from '@/lib/types/tcg.types';
import { IPurchaseItem, ISeller } from '../../domain/types';
import {
  buildWhatsAppQuoteUrl,
  validateWhatsAppQuote,
} from '../../domain/purchases.domain';

interface WhatsAppQuoteButtonProps {
  seller: ISeller | null;
  items: IPurchaseItem[];
  tcgType: TCGType;
  onQuoteSent?: () => void;
  isDisabled?: boolean;
  label?: string;
}

export default function WhatsAppQuoteButton({
  seller,
  items,
  tcgType,
  onQuoteSent,
  isDisabled = false,
  label = 'Enviar cotización',
}: WhatsAppQuoteButtonProps) {
  const validation = useMemo(
    () =>
      validateWhatsAppQuote({
        seller: seller ?? undefined,
        items,
        tcgType,
      }),
    [seller, items, tcgType]
  );

  const tooltipContent = useMemo(() => {
    if (validation.valid) return 'Enviar cotización por WhatsApp';
    return validation.errors.join('. ');
  }, [validation]);

  const handlePress = useCallback(() => {
    if (!validation.valid || !seller) return;

    const url = buildWhatsAppQuoteUrl({ seller, items, tcgType });
    window.open(url, '_blank', 'noopener,noreferrer');
    onQuoteSent?.();
  }, [validation, seller, items, tcgType, onQuoteSent]);

  return (
    <Tooltip content={tooltipContent}>
      <div>
        <Button
          color="success"
          variant="solid"
          startContent={<Icon icon="lucide:message-circle" width={18} />}
          onPress={handlePress}
          isDisabled={isDisabled || !validation.valid}
          className="font-medium"
        >
          {label}
        </Button>
      </div>
    </Tooltip>
  );
}
