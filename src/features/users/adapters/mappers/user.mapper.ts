import { UserFormData } from '../forms/user-form.schema';

export function toCreateUserPayload(data: UserFormData) {
  return {
    createUserInput: {
      name: data.name,
      emailAddress: data.emailAddress,
      role: data.role,
    },
  };
}

export function toUpdateUserPayload(data: UserFormData, guid: string) {
  return {
    updateUserInput: {
      guid,
      name: data.name,
      emailAddress: data.emailAddress,
      role: data.role,
    },
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
  };
}
