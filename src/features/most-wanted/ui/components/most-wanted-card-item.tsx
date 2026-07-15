'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Chip, Switch, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { CardImagePreviewModal } from '@/shared/components/card-image-preview-modal';
import { useCardImagePreview } from '@/shared/hooks/use-card-image-preview';
import { IMostWantedCard } from '../../domain/types';
import { MOST_WANTED_PRIORITY_LABELS } from '../../domain/constants';

interface MostWantedCardItemProps {
  item: IMostWantedCard;
  onToggleActive: (
    guid: string,
    currentActive: boolean
  ) => void | Promise<void>;
  onEdit: (item: IMostWantedCard) => void;
  onRemove: (guid: string) => void | Promise<void>;
}

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  HIGH: { bg: 'bg-danger/10', text: 'text-danger' },
  MEDIUM: { bg: 'bg-warning/10', text: 'text-warning' },
  LOW: { bg: 'bg-default-100', text: 'text-default-500' },
};

export default function MostWantedCardItem({
  item,
  onToggleActive,
  onEdit,
  onRemove,
}: MostWantedCardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.guid });
  const {
    isOpen: isPreviewOpen,
    imageUrl: previewImageUrl,
    alt: previewAlt,
    tcgType: previewTcgType,
    openPreview,
    closePreview,
  } = useCardImagePreview();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityStyle = PRIORITY_STYLES[item.priority] ?? PRIORITY_STYLES.LOW;

  const cardData = item.pokemonCardSummary || item.magicCardSummary;
  const cardName = cardData?.name || 'Unknown';
  const cardImage = cardData?.imageUri || null;
  const cardSet =
    item.pokemonCardSummary?.setName || item.magicCardSummary?.edition || '';
  const cardNumber =
    item.pokemonCardSummary?.cardNumber ||
    item.magicCardSummary?.collectorNumber ||
    '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-default-200 bg-content1 flex items-center gap-3 rounded-lg border p-3 ${
        isDragging ? 'z-50 opacity-90 shadow-lg' : ''
      } ${!item.active ? 'opacity-50' : ''}`}
    >
      <button
        type='button'
        className='text-default-400 hover:text-default-600 flex cursor-grab items-center active:cursor-grabbing'
        {...attributes}
        {...listeners}
      >
        <Icon icon='lucide:grip-vertical' width={20} />
      </button>

      <div
        className='bg-default-100 relative h-12 w-9 shrink-0 cursor-pointer overflow-hidden rounded transition-opacity hover:opacity-80'
        onClick={() =>
          openPreview(
            cardImage,
            cardName,
            item.pokemonCardSummary ? 'POKEMON' : 'MAGIC'
          )
        }
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            openPreview(
              cardImage,
              cardName,
              item.pokemonCardSummary ? 'POKEMON' : 'MAGIC'
            );
          }
        }}
        aria-label={`Ver ${cardName} en tamaño completo`}
      >
        {cardImage ? (
          <img
            src={cardImage}
            alt={cardName}
            className='absolute inset-0 h-full w-full object-contain'
          />
        ) : (
          <div className='text-default-400 flex h-full items-center justify-center'>
            <Icon icon='lucide:image' width={14} />
          </div>
        )}
      </div>

      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <span className='truncate text-sm font-semibold'>{cardName}</span>
        <span className='text-default-500 truncate text-xs'>
          {cardSet} {cardNumber ? `· ${cardNumber}` : ''}
        </span>
        {item.notes && (
          <span className='text-default-400 truncate text-xs italic'>
            {item.notes}
          </span>
        )}
      </div>

      <Chip
        size='sm'
        variant='flat'
        classNames={{
          base: priorityStyle.bg,
          content: `${priorityStyle.text} font-medium`,
        }}
      >
        {MOST_WANTED_PRIORITY_LABELS[item.priority]}
      </Chip>

      <Switch
        size='sm'
        isSelected={item.active}
        onValueChange={() => onToggleActive(item.guid, item.active)}
        aria-label={item.active ? 'Desactivar carta' : 'Activar carta'}
      />

      <div className='flex items-center gap-1'>
        <Tooltip content='Editar'>
          <Button
            isIconOnly
            size='sm'
            variant='light'
            onPress={() => onEdit(item)}
            aria-label='Editar carta'
          >
            <Icon icon='lucide:pencil' width={16} />
          </Button>
        </Tooltip>

        <Tooltip content='Eliminar' color='danger'>
          <Button
            isIconOnly
            size='sm'
            variant='light'
            color='danger'
            onPress={() => onRemove(item.guid)}
            aria-label='Eliminar carta'
          >
            <Icon icon='lucide:trash-2' width={16} />
          </Button>
        </Tooltip>
      </div>
      <CardImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        imageUrl={previewImageUrl}
        alt={previewAlt}
        tcgType={previewTcgType}
      />
    </div>
  );
}
