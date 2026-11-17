import { useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { GenerateQuotationPdfDocument } from '@/lib/api/generated/purchases.generated';

export function useQuotationPdf() {
  const [generatePdf, { loading }] = useLazyQuery(
    GenerateQuotationPdfDocument,
    {
      fetchPolicy: 'network-only',
    }
  );

  const getQuotationPdfUrl = useCallback(
    async (purchaseGuid: string): Promise<string | null> => {
      try {
        const { data } = await generatePdf({
          variables: { purchaseGuid },
        });
        return data?.generateQuotationPDF ?? null;
      } catch {
        toast.error('No se pudo generar el PDF de la cotización');
        return null;
      }
    },
    [generatePdf]
  );

  return { getQuotationPdfUrl, generating: loading };
}
