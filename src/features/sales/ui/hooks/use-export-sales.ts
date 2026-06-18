import { useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { ExportSalesDocument } from '@/lib/api/generated/sales.generated';
import type { FindSalesArgs } from '@/lib/api/schema-types';

interface UseExportSalesReturn {
  handleExport: (findSalesArgs: FindSalesArgs) => void;
  exporting: boolean;
}

export function useExportSales(): UseExportSalesReturn {
  const [exportSales, { loading: exporting, data, error }] = useLazyQuery(
    ExportSalesDocument,
    {
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (data?.exportSales?.success) {
      toast.success('Exportación iniciada. Recibirás el archivo por correo electrónico.');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('Error al iniciar la exportación. Intenta nuevamente.');
    }
  }, [error]);

  const handleExport = useCallback(
    (findSalesArgs: FindSalesArgs) => {
      exportSales({ variables: { findSalesArgs } });
    },
    [exportSales]
  );

  return { handleExport, exporting };
}
