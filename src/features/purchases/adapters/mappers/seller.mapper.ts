import { ISeller } from '../../domain/types';
import { SellerFormData } from '../forms/seller-form.schema';

export function toCreateSellerPayload(data: SellerFormData) {
  return {
    createSellerInput: {
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
    },
  };
}

export function toSellerFormDefaults(seller: ISeller): SellerFormData {
  return {
    name: seller.name,
    phone: seller.phone,
    email: seller.email || '',
  };
}
