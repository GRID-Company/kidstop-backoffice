import { CLIENT_STATUSES, CUSTOMER_ROLES } from '../../domain/constants';
import { ClientStatus, CustomerRole, ICustomer } from '../../domain/types';
import { CustomerFormData } from '../forms/customer-form.schema';

type ApiCustomerFragment = {
  guid: string;
  name: string | null;
  emailAddress: string;
  phone: string | null;
  role: string;
  clientStatus: string | null;
  active: boolean;
  createdDate: unknown;
  updatedDate?: unknown;
};

export function toCustomerDomain(raw: ApiCustomerFragment): ICustomer {
  return {
    guid: raw.guid,
    name: raw.name ?? '',
    emailAddress: raw.emailAddress,
    phone: raw.phone,
    role: (raw.role as CustomerRole) ?? CUSTOMER_ROLES.CLIENT,
    clientStatus: (raw.clientStatus as ClientStatus) ?? CLIENT_STATUSES.STANDARD,
    active: raw.active,
    createdDate: String(raw.createdDate ?? ''),
    updatedDate: raw.updatedDate ? String(raw.updatedDate) : undefined,
  };
}

export function toCustomerFormDefaults(customer: ICustomer): CustomerFormData {
  return {
    name: customer.name,
    emailAddress: customer.emailAddress,
    phone: customer.phone ?? '',
  };
}

export function toCreateCustomerInput(data: CustomerFormData) {
  return {
    createUserInput: {
      name: data.name,
      emailAddress: data.emailAddress,
      phone: data.phone || undefined,
      role: CUSTOMER_ROLES.CLIENT,
    },
  };
}

export function toUpdateCustomerInput(data: CustomerFormData, guid: string) {
  return {
    updateUserInput: {
      guid,
      name: data.name,
      emailAddress: data.emailAddress,
      phone: data.phone || undefined,
    },
  };
}
