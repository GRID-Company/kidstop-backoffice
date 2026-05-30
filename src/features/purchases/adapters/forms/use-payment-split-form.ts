import { useForm, useFieldArray, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { paymentFormSchema } from './payment-form.schema';

const paymentSplitSchema = z.object({
  payments: z.array(paymentFormSchema).min(1, 'Debe agregar al menos un método de pago'),
});

export type PaymentSplitFormData = z.infer<typeof paymentSplitSchema>;

export function usePaymentSplitForm() {
  const form = useForm<PaymentSplitFormData>({
    resolver: zodResolver(paymentSplitSchema) as Resolver<PaymentSplitFormData>,
    defaultValues: {
      payments: [],
    },
    mode: 'all',
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'payments',
  });

  return { ...form, fieldArray };
}
