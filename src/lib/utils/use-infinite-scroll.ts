import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { InfiniteScrollData } from '../types/datatable.types';

interface UseInfiniteScrollProps {
  skipRef: RefObject<HTMLElement>;
  loadMoreData: () => void;
  disabled: boolean;
  offsetDistance?: number;
}

export default function useInfiniteScroll({
  skipRef,
  loadMoreData,
  disabled,
  offsetDistance = 25,
}: UseInfiniteScrollProps) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  // EVENT LISTENER TO HANDLE INIFINITE DATA FETCHING
  useEffect(() => {
    const handleScroll = () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        if (skipRef.current) {
          const anchorPosition =
            skipRef.current.getBoundingClientRect().top + window.scrollY;
          const windowBottomPosition = window.scrollY + window.innerHeight;

          if (
            windowBottomPosition + offsetDistance >= anchorPosition &&
            !disabled
          ) {
            loadMoreData();
          }
        }
      }, 100);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreData, skipRef, disabled]);

  // RECOCILE DATA WHEN A NEW PAGE IS LOADED
  const reconcileWhenNewPage = (
    prevData: InfiniteScrollData<any>,
    setDataMethod: Dispatch<SetStateAction<InfiniteScrollData<any>>>,
    newData: InfiniteScrollData<any>,
    resetList: boolean
  ) => {
    const newState = {
      count: newData?.count ?? 0,
      data: newData?.data ?? [],
    };
    if (!resetList) {
      newState.data = [...prevData.data, ...(newData?.data ?? [])];
    }
    setDataMethod(newState);
  };

  // RECOCILE DATA WHEN A ROW IS CREATED
  const reconcileWhenCreated = (
    setDataMethod: Dispatch<SetStateAction<InfiniteScrollData<any>>>,
    created: any
  ) => {
    setDataMethod((prev) => ({
      count: prev.count + 1,
      data: [created, ...prev.data],
    }));
  };

  // RECOCILE DATA WHEN A ROW IS DELETED
  const reconcileWhenDeleted = (
    setDataMethod: Dispatch<SetStateAction<InfiniteScrollData<any>>>,
    deletedGuid: any
  ) => {
    setDataMethod((prev) => ({
      count:
        prev.data.findIndex((p) => p.guid === deletedGuid) > -1
          ? prev.count - 1
          : prev.count,
      data: prev.data.filter((p) => p.guid !== deletedGuid),
    }));
  };

  // RECOCILE DATA WHEN A ROW IS UPDATED
  const reconcileWhenUpdated = (
    setDataMethod: Dispatch<SetStateAction<InfiniteScrollData<any>>>,
    updated: any
  ) => {
    setDataMethod((prev) => ({
      count: prev.count,
      data: prev.data.map((prev) => {
        if (prev.guid === updated?.guid) {
          return updated;
        }
        return prev;
      }),
    }));
  };

  return {
    reconcileWhenNewPage,
    reconcileWhenCreated,
    reconcileWhenDeleted,
    reconcileWhenUpdated,
  };
}
