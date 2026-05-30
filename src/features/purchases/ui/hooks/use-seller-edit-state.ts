import { useMemo, useState } from 'react';
import { PurchaseStatus, PURCHASE_STATUS } from '../../domain/types';

interface UseSellerEditStateReturn {
  canEditSeller: boolean;
  isEditSellerDrawerOpen: boolean;
  setIsEditSellerDrawerOpen: (open: boolean) => void;
}

export function useSellerEditState(status?: PurchaseStatus): UseSellerEditStateReturn {
  const [isEditSellerDrawerOpen, setIsEditSellerDrawerOpen] = useState(false);

  const canEditSeller = useMemo(() => {
    return (
      status === PURCHASE_STATUS.DRAFT ||
      status === PURCHASE_STATUS.QUOTED ||
      status === PURCHASE_STATUS.REJECTED
    );
  }, [status]);

  return {
    canEditSeller,
    isEditSellerDrawerOpen,
    setIsEditSellerDrawerOpen,
  };
}
