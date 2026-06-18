import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { ExportPurchasesDocument } from '@/lib/api/generated/purchases.generated';
import type { FindPurchasesArgs } from '@/lib/api/schema-types';

interface UseExportPurchasesReturn {
  handleExport: (findPurchasesArgs: FindPurchasesArgs) => void;
  exporting: boolean;
}

export function useExportPurchases(): UseExportPurchasesReturn {
  const [exportPurchases, { loading: exporting }] = useMutation(ExportPurchasesDocument, {
    onCompleted: () => {
      toast.success('Exportación iniciada. Recibirás el archivo por correo electrónico.');
    },
    onError: () => {
      toast.error('Error al iniciar la exportación. Intenta nuevamente.');
    },
  });

  const handleExport = useCallback(
    (findPurchasesArgs: FindPurchasesArgs) => {
      exportPurchases({ variables: { findPurchasesArgs } });
    },
    [exportPurchases]
  );

  return { handleExport, exporting };
}
