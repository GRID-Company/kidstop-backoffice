import { ExportSalesDocument } from '@/lib/api/generated/sales.generated';
import { useExportQuery } from '@/lib/hooks/use-export-query';
import type { FindSalesArgs } from '@/lib/api/schema-types';

export function useExportSales() {
  return useExportQuery<{ findSalesArgs: FindSalesArgs }>({
    document: ExportSalesDocument,
  });
}
