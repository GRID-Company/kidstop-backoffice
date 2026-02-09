import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CARD_CONDITIONS } from '../../domain/constants';
import { CardPriceFormData, cardPriceFormSchema } from './card-price.form.schema';

export function useCardPriceForm(defaults?: Partial<CardPriceFormData>) {
  return useForm<CardPriceFormData>({
    resolver: zodResolver(cardPriceFormSchema),
    defaultValues: {
      condition: CARD_CONDITIONS.NEAR_MINT,
      buyPrice: 0,
      sellPrice: 0,
      ...defaults,
    },
    mode: 'all',
  });
}
