import { Icon } from '@iconify/react';
import { IPurchaseItem } from '../../domain/types';
import { CARD_CONDITION_LABELS } from '@/lib/types/card.types';

interface PurchaseItemSummaryCardProps {
  item: IPurchaseItem;
  variant: 'unique' | 'duplicate';
}

export function PurchaseItemSummaryCard({
  item,
  variant,
}: PurchaseItemSummaryCardProps) {
  const icon =
    variant === 'unique' ? 'lucide:check-circle' : 'lucide:alert-circle';
  const iconColor = variant === 'unique' ? 'text-success' : 'text-warning';
  const borderColor =
    variant === 'unique' ? 'border-success-200' : 'border-warning-200';
  const bgColor =
    variant === 'unique' ? 'bg-success-50/50' : 'bg-warning-50/50';

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border ${borderColor} ${bgColor} p-3`}
    >
      <Icon icon={icon} width={20} className={`${iconColor} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{item.cardName}</p>
        <p className="text-xs text-default-500 truncate">
          {item.setName} · {item.setCode}
        </p>
        <p className="text-xs text-default-400">
          Condición: {CARD_CONDITION_LABELS[item.condition]}
        </p>
        {variant === 'duplicate' && (
          <p className="mt-1 text-xs text-warning font-medium">
            ⚠️ Ya está en la compra
          </p>
        )}
      </div>
    </div>
  );
}
