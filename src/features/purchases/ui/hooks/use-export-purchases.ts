import { useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { ExportPurchasesDocument } from '@/lib/api/generated/purchases.generated';
import type { FindPurchasesArgs } from '@/lib/api/schema-types';

interface UseExportPurchasesReturn {
  handleExport: (findPurchasesArgs: FindPurchasesArgs) => void;
  exporting: boolean;
}

export function useExportPurchases(): UseExportPurchasesReturn {
  const [exportPurchases, { loading: exporting, data, error }] = useLazyQuery(
    ExportPurchasesDocument,
    {
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (data?.exportPurchases?.success) {
      toast.success('Exportación iniciada. Recibirás el archivo por correo electrónico.');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('Error al iniciar la exportación. Intenta nuevamente.');
    }
  }, [error]);

  const handleExport = useCallback(
    (findPurchasesArgs: FindPurchasesArgs) => {
      exportPurchases({ variables: { findPurchasesArgs } });
    },
    [exportPurchases]
  );

  return { handleExport, exporting };
}
