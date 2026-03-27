'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Icon } from '@iconify/react';

import { IMostWantedCard, MostWantedPriority } from '../../domain/types';
import MostWantedCardItem from './most-wanted-card-item';
import EditCardModal from './edit-card-modal';

interface MostWantedListProps {
  items: IMostWantedCard[];
  onReorder: (activeId: string, overId: string) => void | Promise<void>;
  onToggleActive: (guid: string, currentActive: boolean) => void | Promise<void>;
  onUpdateCard: (guid: string, updates: { priority?: MostWantedPriority; notes?: string; active?: boolean }) => void | Promise<void>;
  onRemoveCard: (guid: string) => void | Promise<void>;
}

export default function MostWantedList({
  items,
  onReorder,
  onToggleActive,
  onUpdateCard,
  onRemoveCard,
}: MostWantedListProps) {
  const [editingItem, setEditingItem] = useState<IMostWantedCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
  };

  const handleSave = (id: string, updates: { priority: MostWantedPriority; notes: string }) => {
    onUpdateCard(id, updates);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-default-400">
        <Icon icon="lucide:list" width={40} />
        <p className="text-lg font-medium">No hay cartas en Most Wanted</p>
        <p className="text-sm">Agrega cartas para comenzar a configurar la lista</p>
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.guid)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <MostWantedCardItem
                key={item.guid}
                item={item}
                onToggleActive={onToggleActive}
                onEdit={setEditingItem}
                onRemove={onRemoveCard}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <EditCardModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSave}
      />
    </>
  );
}
