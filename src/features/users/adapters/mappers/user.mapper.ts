import { CreateUserInput, UpdateUserInput } from '@/lib/api/schema-types';
import { UserFormData } from '../forms/user-form.schema';

export function toCreateUserPayload(data: UserFormData) {
  const payload: CreateUserInput = {
    name: data.name,
    emailAddress: data.emailAddress,
    role: data.role,
  };

  if (data.password) {
    payload.password = data.password;
  }

  return {
    createUserInput: payload,
  };
}

export function toUpdateUserPayload(data: UserFormData, guid: string) {
  return {
    updateUserInput: {
      guid,
      name: data.name,
      emailAddress: data.emailAddress,
      role: data.role,
    } as UpdateUserInput,
  };
}

export function toUserFormDefaults(user: {
  name?: string | null;
  emailAddress: string;
  role: string;
}): Partial<UserFormData> {
  return {
    name: user.name ?? '',
    emailAddress: user.emailAddress,
    role: user.role as UserFormData['role'],
    password: '',
  };
}
