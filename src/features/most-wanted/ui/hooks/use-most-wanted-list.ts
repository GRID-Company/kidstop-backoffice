import { useMemo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { arrayMove } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import {
  MostWantedCardsDocument,
  AddMostWantedCardDocument,
  UpdateMostWantedCardDocument,
  RemoveMostWantedCardDocument,
  ReorderMostWantedCardsDocument,
} from '@/lib/api/generated/most-wanted.generated';
import { IMostWantedCard, MostWantedPriority } from '../../domain/types';
import { toAddMostWantedCardInput, toUpdateMostWantedCardInput } from '../../adapters/mappers/most-wanted.mapper';
import { MostWantedCardFormData } from '../../adapters/forms/most-wanted-card.schema';

const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export function useMostWantedList() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);

  const { data, loading, refetch } = useQuery(MostWantedCardsDocument, {
    variables: {
      findMostWantedCardsArgs: {
        skip: 0,
        limit: 100,
        sort: { column: 'priority', order: 'ASC' },
        filters: { tcg: selectedTCG },
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const [addMutation, { loading: adding }] = useMutation(AddMostWantedCardDocument, {
    refetchQueries: [MostWantedCardsDocument],
  });

  const [updateMutation, { loading: updating }] = useMutation(UpdateMostWantedCardDocument, {
    refetchQueries: [MostWantedCardsDocument],
  });

  const [removeMutation, { loading: removing }] = useMutation(RemoveMostWantedCardDocument, {
    refetchQueries: [MostWantedCardsDocument],
  });

  const [reorderMutation, { loading: reordering }] = useMutation(ReorderMostWantedCardsDocument, {
    refetchQueries: [MostWantedCardsDocument],
  });

  const items = useMemo(() => {
    const cards = (data?.mostWantedCards.data ?? []) as IMostWantedCard[];
    return cards.sort((a, b) => {
      const priorityDiff = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] - PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });
  }, [data]);

  const addCard = useCallback(
    async (formData: MostWantedCardFormData) => {
      try {
        const input = toAddMostWantedCardInput(formData, selectedTCG);
        await addMutation({ variables: { addMostWantedCardInput: input } });
        toast.success('Carta agregada a Most Wanted');
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          toast.error('Esta carta ya está en Most Wanted');
        } else {
          toast.error('Error al agregar carta');
        }
        throw error;
      }
    },
    [addMutation, selectedTCG]
  );

  const updateCard = useCallback(
    async (guid: string, updates: { priority?: MostWantedPriority; notes?: string; active?: boolean }) => {
      try {
        const input = toUpdateMostWantedCardInput(guid, updates);
        await updateMutation({ variables: { updateMostWantedCardInput: input } });
        toast.success('Carta actualizada');
      } catch {
        toast.error('Error al actualizar carta');
        throw new Error('Update failed');
      }
    },
    [updateMutation]
  );

  const toggleActive = useCallback(
    async (guid: string, currentActive: boolean) => {
      try {
        const input = toUpdateMostWantedCardInput(guid, { active: !currentActive });
        await updateMutation({ variables: { updateMostWantedCardInput: input } });
        toast.success(currentActive ? 'Carta desactivada' : 'Carta activada');
      } catch {
        toast.error('Error al cambiar estado');
        throw new Error('Toggle failed');
      }
    },
    [updateMutation]
  );

  const removeCard = useCallback(
    async (guid: string) => {
      try {
        await removeMutation({ variables: { mostWantedCardGuid: guid } });
        toast.success('Carta eliminada de Most Wanted');
      } catch {
        toast.error('Error al eliminar carta');
        throw new Error('Remove failed');
      }
    },
    [removeMutation]
  );

  const reorder = useCallback(
    async (activeId: string, overId: string) => {
      const oldIndex = items.findIndex((i) => i.guid === activeId);
      const newIndex = items.findIndex((i) => i.guid === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(items, oldIndex, newIndex);

      const cardOrders = reordered.map((item, index) => {
        let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
        const totalItems = reordered.length;
        const highThreshold = Math.ceil(totalItems / 3);
        const mediumThreshold = Math.ceil((totalItems * 2) / 3);

        if (index < highThreshold) {
          priority = 'HIGH';
        } else if (index < mediumThreshold) {
          priority = 'MEDIUM';
        } else {
          priority = 'LOW';
        }

        return {
          mostWantedCardGuid: item.guid,
          priority,
        };
      });

      try {
        await reorderMutation({
          variables: {
            reorderMostWantedCardsInput: {
              tcg: selectedTCG,
              cardOrders,
            },
          },
        });
        toast.success('Orden actualizado');
      } catch {
        toast.error('Error al reordenar');
        throw new Error('Reorder failed');
      }
    },
    [items, reorderMutation, selectedTCG]
  );

  return {
    items,
    loading,
    adding,
    updating,
    removing,
    reordering,
    reorder,
    toggleActive,
    updateCard,
    removeCard,
    addCard,
    selectedTCG,
    refetch,
  };
}
