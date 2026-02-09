import { ICustomer } from '../../domain/types';
import { CustomerFormData } from '../forms/customer-form.schema';

export function toCustomerFormDefaults(customer: ICustomer): CustomerFormData {
  return {
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? '',
    type: customer.type,
    notes: customer.notes ?? '',
  };
}

export function toCreateCustomerPayload(data: CustomerFormData) {
  return {
    createCustomerInput: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      type: data.type,
      notes: data.notes || null,
    },
  };
}

export function toUpdateCustomerPayload(data: CustomerFormData, customerId: string) {
  return {
    updateCustomerInput: {
      id: customerId,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      type: data.type,
      notes: data.notes || null,
    },
  };
}
