import { PurchaseStatus, PURCHASE_STATUS } from './types';

export const PURCHASE_STATUS_TRANSITIONS: Record<PurchaseStatus, PurchaseStatus[]> = {
  [PURCHASE_STATUS.DRAFT]: [PURCHASE_STATUS.QUOTED, PURCHASE_STATUS.REJECTED],
  [PURCHASE_STATUS.QUOTED]: [PURCHASE_STATUS.WAITING_PRICE, PURCHASE_STATUS.REJECTED],
  [PURCHASE_STATUS.WAITING_PRICE]: [PURCHASE_STATUS.FINALIZED],
  [PURCHASE_STATUS.FINALIZED]: [],
  [PURCHASE_STATUS.REJECTED]: [],
};

export function canTransitionTo(
  currentStatus: PurchaseStatus,
  newStatus: PurchaseStatus
): boolean {
  const allowedTransitions = PURCHASE_STATUS_TRANSITIONS[currentStatus];
  return allowedTransitions.includes(newStatus);
}

export function getAvailableTransitions(currentStatus: PurchaseStatus): PurchaseStatus[] {
  return PURCHASE_STATUS_TRANSITIONS[currentStatus];
}

export function isTerminalStatus(status: PurchaseStatus): boolean {
  return status === PURCHASE_STATUS.FINALIZED || status === PURCHASE_STATUS.REJECTED;
}

export function isEditable(status: PurchaseStatus): boolean {
  return status === PURCHASE_STATUS.DRAFT || status === PURCHASE_STATUS.QUOTED;
}

export function canAdjustPrices(status: PurchaseStatus): boolean {
  return status === PURCHASE_STATUS.WAITING_PRICE;
}

export function canFinalize(status: PurchaseStatus): boolean {
  return status === PURCHASE_STATUS.WAITING_PRICE;
}
