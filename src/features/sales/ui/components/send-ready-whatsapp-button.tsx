'use client';

import { useCallback, useMemo } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

import { ISale, SALE_STATUS } from '../../domain/types';
import { buildWhatsAppReadyUrl } from '../../domain/sales.domain';

interface SendReadyWhatsAppButtonProps {
  sale: ISale;
}

export default function SendReadyWhatsAppButton({
  sale,
}: SendReadyWhatsAppButtonProps) {
  const isVisible = sale.status === SALE_STATUS.READY;
  const customerPhone = sale.customer?.phone;

  const canSend = useMemo(() => {
    return isVisible && !!customerPhone;
  }, [isVisible, customerPhone]);

  const handleSend = useCallback(() => {
    if (!customerPhone) return;

    const url = buildWhatsAppReadyUrl({
      sale,
      customerPhone,
    });
    
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [sale, customerPhone]);

  if (!canSend) return null;

  return (
    <Tooltip content="Notificar al cliente por WhatsApp que su pedido está listo">
      <Button
        color="success"
        variant="solid"
        startContent={<Icon icon="lucide:message-circle" width={18} />}
        onPress={handleSend}
        className="font-medium"
      >
        Notificar vía WhatsApp
      </Button>
    </Tooltip>
  );
}
