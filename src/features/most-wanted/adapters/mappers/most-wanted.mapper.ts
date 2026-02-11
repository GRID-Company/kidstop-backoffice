import { IMostWantedCard } from '../../domain/types';
import { MostWantedCardFormData } from '../forms/most-wanted-card.schema';

export function toAddMostWantedPayload(data: MostWantedCardFormData, tcgType: string) {
  return {
    addMostWantedInput: {
      cardId: data.cardId,
      tcgType,
      priority: data.priority,
      notes: data.notes,
      isActive: data.isActive,
      order: data.order,
    },
  };
}

export function toUpdateMostWantedPayload(data: MostWantedCardFormData, id: string) {
  return {
    updateMostWantedInput: {
      id,
      priority: data.priority,
      notes: data.notes,
      isActive: data.isActive,
      order: data.order,
    },
  };
}

export function toMostWantedFormDefaults(item: IMostWantedCard): MostWantedCardFormData {
  return {
    cardId: item.card.id,
    priority: item.priority,
    notes: item.notes,
    isActive: item.isActive,
    order: item.order,
  };
}
