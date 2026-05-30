'use client';

import { Icon } from '@iconify/react';

import { PURCHASE_STATUS, PurchaseStatus } from '../../domain/types';
import { PURCHASE_STATUS_LABELS } from '../../domain/constants';

interface PurchaseTimelineProps {
  currentStatus: PurchaseStatus;
}

const TIMELINE_STEPS: { status: PurchaseStatus; icon: string }[] = [
  { status: PURCHASE_STATUS.DRAFT, icon: 'lucide:file-text' },
  { status: PURCHASE_STATUS.QUOTED, icon: 'lucide:send' },
  { status: PURCHASE_STATUS.WAITING_PRICE, icon: 'lucide:dollar-sign' },
  { status: PURCHASE_STATUS.FINALIZED, icon: 'lucide:check-circle' },
];

const STATUS_ORDER: Record<string, number> = {
  [PURCHASE_STATUS.DRAFT]: 0,
  [PURCHASE_STATUS.QUOTED]: 1,
  [PURCHASE_STATUS.WAITING_PRICE]: 2,
  [PURCHASE_STATUS.FINALIZED]: 3,
};

export default function PurchaseTimeline({ currentStatus }: PurchaseTimelineProps) {
  const isRejected = currentStatus === PURCHASE_STATUS.REJECTED;
  const currentIndex = STATUS_ORDER[currentStatus] ?? -1;

  return (
    <div className="flex w-full flex-col gap-2">
      {isRejected && (
        <div className="flex items-center gap-2 rounded-lg bg-danger-50 px-3 py-2">
          <Icon icon="lucide:x-circle" width={16} className="text-danger" />
          <span className="text-sm font-medium text-danger">
            {PURCHASE_STATUS_LABELS[PURCHASE_STATUS.REJECTED]}
          </span>
        </div>
      )}
      <div className="flex items-center gap-0">
        {TIMELINE_STEPS.map((step, idx) => {
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex && !isRejected;
          const isFuture = idx > currentIndex || isRejected;

          return (
            <div key={step.status} className={`flex items-center ${idx < TIMELINE_STEPS.length - 1 ? 'flex-1' : 'shrink-0'}`}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    isCurrent
                      ? 'bg-accent text-white shadow-md'
                      : isPast
                        ? 'bg-success-100 text-success'
                        : 'bg-default-100 text-default-400'
                  }`}
                >
                  <Icon
                    icon={isPast ? 'lucide:check' : step.icon}
                    width={18}
                  />
                </div>
                <span
                  className={`text-center text-[10px] leading-tight ${
                    isCurrent
                      ? 'font-bold text-accent'
                      : isPast
                        ? 'font-medium text-success'
                        : 'text-default-400'
                  }`}
                >
                  {PURCHASE_STATUS_LABELS[step.status]}
                </span>
              </div>
              {idx < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 rounded-full transition-colors ${
                    idx < currentIndex ? 'bg-success' : 'bg-default-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
