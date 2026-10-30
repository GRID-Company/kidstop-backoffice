import { Icon } from '@iconify/react';
import { IPurchaseItem } from '../../domain/types';
import { CARD_CONDITION_LABELS } from '@/lib/types/card.types';
import CardAttributeChips from '@/shared/components/card-attribute-chips';

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
      <Icon icon={icon} width={20} className={`${iconColor} mt-0.5 shrink-0`} />
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-semibold'>{item.cardName}</p>
        <p className='text-default-500 truncate text-xs'>
          {item.setName} · {item.setCode}
        </p>
        <div className='mt-1 flex items-center gap-2'>
          <p className='text-default-400 text-xs'>
            Condición: {CARD_CONDITION_LABELS[item.condition]}
          </p>
          <CardAttributeChips
            tcgType={item.tcgType}
            isFoil={item.isFoil}
            variant={item.variant}
            language={item.language}
            rarity={item.rarity}
            type={item.type}
            hp={item.hp}
            stage={item.stage}
          />
        </div>
        {variant === 'duplicate' && (
          <p className='text-warning mt-1 text-xs font-medium'>
            ⚠️ Ya está en la compra
          </p>
        )}
      </div>
    </div>
  );
}
