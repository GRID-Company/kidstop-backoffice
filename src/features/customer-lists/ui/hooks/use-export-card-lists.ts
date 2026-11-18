import { useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import toast from 'react-hot-toast';

import {
  ExportCustomerCardListsDocument,
  ExportCustomerListsForMarketingDocument,
  type ExportCustomerCardListsQueryVariables,
  type ExportCustomerListsForMarketingQueryVariables,
} from '@/lib/api/generated/card-lists.generated';
import { EXPORT_MESSAGES } from '../../domain/constants';

function openDownload(downloadUrl: string | undefined) {
  if (!downloadUrl) {
    toast.error(EXPORT_MESSAGES.ERROR);
    return;
  }
  window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  toast.success(EXPORT_MESSAGES.SUCCESS);
}

interface UseExportCardListsReturn {
  handleExportLists: (
    variables: ExportCustomerCardListsQueryVariables
  ) => Promise<void>;
  handleExportMarketing: (
    variables: ExportCustomerListsForMarketingQueryVariables
  ) => Promise<void>;
  exportingLists: boolean;
  exportingMarketing: boolean;
}

export function useExportCardLists(): UseExportCardListsReturn {
  const [exportLists, { loading: exportingLists }] = useLazyQuery(
    ExportCustomerCardListsDocument,
    { fetchPolicy: 'network-only' }
  );
  const [exportMarketing, { loading: exportingMarketing }] = useLazyQuery(
    ExportCustomerListsForMarketingDocument,
    { fetchPolicy: 'network-only' }
  );

  const handleExportLists = useCallback(
    async (variables: ExportCustomerCardListsQueryVariables) => {
      try {
        const result = await exportLists({ variables });
        openDownload(result.data?.exportCustomerCardLists?.downloadUrl);
      } catch (err) {
        console.error('[Export Customer Card Lists Error]', err);
        toast.error(EXPORT_MESSAGES.ERROR);
      }
    },
    [exportLists]
  );

  const handleExportMarketing = useCallback(
    async (variables: ExportCustomerListsForMarketingQueryVariables) => {
      try {
        const result = await exportMarketing({ variables });
        openDownload(result.data?.exportCustomerListsForMarketing?.downloadUrl);
      } catch (err) {
        console.error('[Export Marketing Card Lists Error]', err);
        toast.error(EXPORT_MESSAGES.ERROR);
      }
    },
    [exportMarketing]
  );

  return {
    handleExportLists,
    handleExportMarketing,
    exportingLists,
    exportingMarketing,
  };
}
