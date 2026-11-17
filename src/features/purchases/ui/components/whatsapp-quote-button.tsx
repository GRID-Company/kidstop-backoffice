'use client';

import { useMemo, useCallback, useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

import { ConfirmationModal } from '@/shared/blocks/confirmation-modal';
import { TCGType } from '@/lib/types/tcg.types';
import { IPurchaseItem, ISeller } from '../../domain/types';
import {
  buildWhatsAppQuoteUrl,
  validateWhatsAppQuote,
} from '../../domain/purchases.domain';
import { useQuotationPdf } from '../hooks/use-quotation-pdf';

interface WhatsAppQuoteButtonProps {
  purchaseGuid: string;
  purchaseReference: string;
  seller: ISeller | null;
  items: IPurchaseItem[];
  tcgType: TCGType;
  hasUnsavedChanges?: boolean;
  canSaveChanges?: boolean;
  onSaveChanges?: () => Promise<boolean>;
  onQuoteSent?: () => void;
  isDisabled?: boolean;
  label?: string;
}

export default function WhatsAppQuoteButton({
  purchaseGuid,
  purchaseReference,
  seller,
  items,
  tcgType,
  hasUnsavedChanges = false,
  canSaveChanges = false,
  onSaveChanges,
  onQuoteSent,
  isDisabled = false,
  label = 'Enviar cotización',
}: WhatsAppQuoteButtonProps) {
  const { getQuotationPdfUrl, generating } = useQuotationPdf();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

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
    if (generating) return 'Generando PDF de la cotización...';
    if (validation.valid) return 'Enviar cotización por WhatsApp';
    return validation.errors.join('. ');
  }, [validation, generating]);

  const sendQuote = useCallback(
    async (quoteWindow: Window | null) => {
      if (!seller) return;

      const pdfUrl = await getQuotationPdfUrl(purchaseGuid);
      if (!pdfUrl) {
        quoteWindow?.close();
        return;
      }

      const url = buildWhatsAppQuoteUrl({
        seller,
        items,
        tcgType,
        purchaseReference,
        pdfUrl,
      });

      if (quoteWindow) {
        quoteWindow.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }

      onQuoteSent?.();
    },
    [
      seller,
      items,
      tcgType,
      purchaseGuid,
      purchaseReference,
      getQuotationPdfUrl,
      onQuoteSent,
    ]
  );

  const handlePress = useCallback(() => {
    if (!validation.valid || !seller) return;

    if (hasUnsavedChanges) {
      setIsConfirmOpen(true);
      return;
    }

    void sendQuote(window.open('', '_blank', 'noopener,noreferrer'));
  }, [validation, seller, hasUnsavedChanges, sendQuote]);

  const handleConfirmSend = useCallback(async () => {
    const quoteWindow = window.open('', '_blank', 'noopener,noreferrer');

    if (canSaveChanges && onSaveChanges) {
      setSaving(true);
      const saved = await onSaveChanges();
      setSaving(false);
      if (!saved) {
        quoteWindow?.close();
        return;
      }
    }

    setIsConfirmOpen(false);
    void sendQuote(quoteWindow);
  }, [canSaveChanges, onSaveChanges, sendQuote]);

  return (
    <>
      <Tooltip content={tooltipContent}>
        <div>
          <Button
            color='success'
            variant='solid'
            startContent={<Icon icon='lucide:message-circle' width={18} />}
            onPress={handlePress}
            isDisabled={isDisabled || !validation.valid}
            isLoading={generating}
            className='font-medium'
            data-testid='whatsapp-quote-button'
          >
            {label}
          </Button>
        </div>
      </Tooltip>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title='Cambios sin guardar'
        message={
          canSaveChanges
            ? 'La compra tiene cambios que no se han guardado. ¿Deseas guardarlos antes de enviar la cotización?'
            : 'La compra tiene cambios locales que no se pueden guardar en su estado actual. La cotización se enviará con la información guardada.'
        }
        confirmLabel={
          canSaveChanges ? 'Guardar y enviar' : 'Enviar de todos modos'
        }
        onConfirm={handleConfirmSend}
        isLoading={saving}
      />
    </>
  );
}
