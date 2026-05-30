import { AddMostWantedCardInput, UpdateMostWantedCardInput } from '@/lib/api/schema-types';
import { IMostWantedCard } from '../../domain/types';
import { MostWantedCardFormData } from '../forms/most-wanted-card.schema';

export function toAddMostWantedCardInput(
  data: MostWantedCardFormData,
  tcg: 'POKEMON' | 'MAGIC'
): AddMostWantedCardInput {
  return {
    tcg,
    cardGuid: data.cardId,
    priority: data.priority,
    active: data.isActive,
    notes: data.notes || undefined,
  };
}

export function toUpdateMostWantedCardInput(
  mostWantedCardGuid: string,
  data: Partial<MostWantedCardFormData> & { active?: boolean }
): UpdateMostWantedCardInput {
  return {
    mostWantedCardGuid,
    priority: data.priority,
    active: data.active !== undefined ? data.active : data.isActive,
    notes: data.notes || undefined,
  };
}

export function toMostWantedFormDefaults(item: IMostWantedCard): MostWantedCardFormData {
  const cardGuid = item.pokemonCardSummary?.guid || item.magicCardSummary?.guid || '';
  
  return {
    cardId: cardGuid,
    priority: item.priority,
    notes: item.notes || '',
    isActive: item.active,
    order: 0,
  };
}
