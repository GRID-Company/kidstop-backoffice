import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { ExportSalesDocument } from '@/lib/api/generated/sales.generated';
import type { FindSalesArgs } from '@/lib/api/schema-types';

interface UseExportSalesReturn {
  handleExport: (findSalesArgs: FindSalesArgs) => void;
  exporting: boolean;
}

export function useExportSales(): UseExportSalesReturn {
  const [exportSales, { loading: exporting }] = useMutation(ExportSalesDocument, {
    onCompleted: () => {
      toast.success('Exportación iniciada. Recibirás el archivo por correo electrónico.');
    },
    onError: () => {
      toast.error('Error al iniciar la exportación. Intenta nuevamente.');
    },
  });

  const handleExport = useCallback(
    (findSalesArgs: FindSalesArgs) => {
      exportSales({ variables: { findSalesArgs } });
    },
    [exportSales]
  );

  return { handleExport, exporting };
}
