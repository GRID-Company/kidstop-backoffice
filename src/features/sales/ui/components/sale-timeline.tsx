'use client';

import { Icon } from '@iconify/react';

import { SALE_STATUS, SaleStatus } from '../../domain/types';
import { SALE_STATUS_LABELS } from '../../domain/constants';

interface SaleTimelineProps {
  currentStatus: SaleStatus;
}

const TIMELINE_STEPS: { status: SaleStatus; icon: string }[] = [
  { status: SALE_STATUS.NEW, icon: 'lucide:inbox' },
  { status: SALE_STATUS.IN_PROGRESS, icon: 'lucide:search' },
  { status: SALE_STATUS.READY_FOR_PICKUP, icon: 'lucide:package-check' },
  { status: SALE_STATUS.COMPLETED, icon: 'lucide:check-circle' },
];

const STATUS_ORDER: Record<string, number> = {
  [SALE_STATUS.NEW]: 0,
  [SALE_STATUS.IN_PROGRESS]: 1,
  [SALE_STATUS.READY_FOR_PICKUP]: 2,
  [SALE_STATUS.COMPLETED]: 3,
};

export default function SaleTimeline({ currentStatus }: SaleTimelineProps) {
  const isCancelled = currentStatus === SALE_STATUS.CANCELLED;
  const currentIndex = STATUS_ORDER[currentStatus] ?? -1;

  return (
    <div className="flex flex-col gap-2">
      {isCancelled && (
        <div className="flex items-center gap-2 rounded-lg bg-danger-50 px-3 py-2">
          <Icon icon="lucide:x-circle" width={16} className="text-danger" />
          <span className="text-sm font-medium text-danger">
            {SALE_STATUS_LABELS[SALE_STATUS.CANCELLED]}
          </span>
        </div>
      )}
      <div className="flex items-center gap-0">
        {TIMELINE_STEPS.map((step, idx) => {
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex && !isCancelled;
          const isFuture = idx > currentIndex || isCancelled;

          return (
            <div key={step.status} className="flex flex-1 items-center">
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
                  {SALE_STATUS_LABELS[step.status]}
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
