import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MOST_WANTED_PRIORITIES } from '../../domain/types';
import { MostWantedCardFormData, mostWantedCardFormSchema } from './most-wanted-card.schema';

export function useMostWantedForm(defaults?: Partial<MostWantedCardFormData>) {
  return useForm<MostWantedCardFormData>({
    resolver: zodResolver(mostWantedCardFormSchema) as Resolver<MostWantedCardFormData>,
    defaultValues: {
      cardId: '',
      priority: MOST_WANTED_PRIORITIES.MEDIUM,
      notes: '',
      isActive: true,
      order: 0,
      ...defaults,
    },
    mode: 'all',
  });
}
