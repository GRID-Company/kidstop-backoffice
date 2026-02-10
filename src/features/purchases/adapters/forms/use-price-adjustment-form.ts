import { useForm, useFieldArray, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  priceAdjustmentFormSchema,
  PriceAdjustmentFormData,
} from './price-adjustment-form.schema';

export type { PriceAdjustmentFormData };

export function usePriceAdjustmentForm() {
  const form = useForm<PriceAdjustmentFormData>({
    resolver: zodResolver(priceAdjustmentFormSchema) as Resolver<PriceAdjustmentFormData>,
    defaultValues: {
      items: [],
    },
    mode: 'all',
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'items',
  });

  return { ...form, fieldArray };
}
