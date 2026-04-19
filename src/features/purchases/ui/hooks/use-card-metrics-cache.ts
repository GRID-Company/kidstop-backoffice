import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { DocumentNode } from 'graphql';

interface UseCardMetricsCacheOptions {
  cardGuids: string[];
  query: DocumentNode;
  cacheKey: string;
  dataExtractor: (data: any) => number | null;
}

interface UseCardMetricsCacheReturn {
  metricsCache: Record<string, any>;
  loading: boolean;
}

export function useCardMetricsCache({
  cardGuids,
  query,
  cacheKey,
  dataExtractor,
}: UseCardMetricsCacheOptions): UseCardMetricsCacheReturn {
  const [metricsCache, setMetricsCache] = useState<Record<string, any>>({});
  const fetchedGuidsRef = useRef<Set<string>>(new Set());

  const [fetchMetrics, { loading }] = useLazyQuery(query, {
    fetchPolicy: 'cache-and-network',
  });

  const fetchData = useCallback(async () => {
    for (const guid of cardGuids) {
      if (fetchedGuidsRef.current.has(guid)) continue;
      fetchedGuidsRef.current.add(guid);

      try {
        const { data } = await fetchMetrics({
          variables: { guid },
        });

        const dataRecord = data as Record<string, any> | null | undefined;
        if (dataRecord && cacheKey in dataRecord && dataRecord[cacheKey]) {
          setMetricsCache((prev) => ({
            ...prev,
            [guid]: dataRecord[cacheKey],
          }));
        }
      } catch (error) {
        console.warn(`Failed to fetch metrics for ${guid}:`, error);
      }
    }
  }, [cardGuids, fetchMetrics, cacheKey]);

  useEffect(() => {
    if (cardGuids.length > 0) {
      fetchData();
    }
  }, [cardGuids, fetchData]);

  return {
    metricsCache,
    loading,
  };
}
