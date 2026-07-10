import { ExportPurchasesDocument } from '@/lib/api/generated/purchases.generated';
import { useExportQuery } from '@/lib/hooks/use-export-query';
import type { FindPurchasesArgs } from '@/lib/api/schema-types';

export function useExportPurchases() {
  return useExportQuery<{ findPurchasesArgs: FindPurchasesArgs }>({
    document: ExportPurchasesDocument,
  });
}
