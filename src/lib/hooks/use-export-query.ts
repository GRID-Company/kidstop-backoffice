import { useCallback, useEffect } from 'react';
import { DocumentNode, OperationVariables } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { EXPORT_MESSAGES } from '@/lib/consts/export-messages';

interface UseExportQueryOptions {
  document: DocumentNode;
  successMessage?: string;
  errorMessage?: string;
}

interface UseExportQueryReturn<TVariables extends OperationVariables> {
  handleExport: (variables: TVariables) => void;
  exporting: boolean;
}

export function useExportQuery<TVariables extends OperationVariables>({
  document,
  successMessage = EXPORT_MESSAGES.SUCCESS,
  errorMessage = EXPORT_MESSAGES.ERROR,
}: UseExportQueryOptions): UseExportQueryReturn<TVariables> {
  const [exportQuery, { loading: exporting, data, error }] = useLazyQuery(
    document,
    {
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (data && Object.values(data)[0]?.success) {
      toast.success(successMessage);
    }
  }, [data, successMessage]);

  useEffect(() => {
    if (error) {
      console.error('[Export Error]', error);
      toast.error(errorMessage);
    }
  }, [error, errorMessage]);

  const handleExport = useCallback(
    (variables: TVariables) => {
      exportQuery({ variables });
    },
    [exportQuery]
  );

  return { handleExport, exporting };
}
