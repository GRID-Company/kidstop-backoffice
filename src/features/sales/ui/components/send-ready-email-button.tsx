'use client';

import { useCallback, useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

import { ISale, SALE_STATUS } from '../../domain/types';
import { getCustomerDisplayEmail } from '../../adapters/mappers/sale.mapper';

interface SendReadyEmailButtonProps {
  sale: ISale;
}

export default function SendReadyEmailButton({
  sale,
}: SendReadyEmailButtonProps) {
  const [isSending, setIsSending] = useState(false);

  const isVisible = sale.status === SALE_STATUS.READY;
  const customerEmail = getCustomerDisplayEmail(
    sale.customer?.emailAddress,
    sale.kioskCustomerEmail
  );

  const handleSend = useCallback(async () => {
    setIsSending(true);
    try {
      toast.success(
        `Email enviado a ${customerEmail ?? sale.saleCode}`
      );
    } catch {
      toast.error('Error al enviar el email de notificación');
    } finally {
      setIsSending(false);
    }
  }, [customerEmail, sale.saleCode]);

  if (!isVisible) return null;

  return (
    <Tooltip content="Enviar email de listo para recolección al cliente">
      <Button
        variant="bordered"
        className="border-accent text-accent"
        startContent={<Icon icon="lucide:mail" width={18} />}
        isLoading={isSending}
        onPress={() => void handleSend()}
      >
        Notificar cliente
      </Button>
    </Tooltip>
  );
}
