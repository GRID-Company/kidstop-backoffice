import { InventoryType } from '../../domain/inventory-create.domain';
import { ChapeForm } from '../forms/chape.form.schema';
import { GlassForm } from '../forms/glass.form.schema';
import { ProfileForm } from '../forms/profile.form.schema';

export function toProfilePayload(
  data: ProfileForm,
  isCreate: boolean,
  branchOfficeGuid: string
) {
  return {
    [isCreate ? 'createProfileInput' : 'updateProfileInput']: {
      ...data,
      branchOfficeGuid,
    },
  };
}

export function toChapePayload(
  data: ChapeForm,
  isCreate: boolean,
  branchOfficeGuid: string
) {
  return {
    [isCreate ? 'createChapeInput' : 'updateChapeInput']: {
      ...data,
      branchOfficeGuid,
    },
  };
}

export function toGlassPayload(
  data: GlassForm,
  isCreate: boolean,
  branchOfficeGuid: string
) {
  return {
    [isCreate ? 'createGlassInput' : 'updateGlassInput']: {
      ...data,
      branchOfficeGuid,
    },
  };
}

export function toInventoryPayload(
  data: ProfileForm | ChapeForm | GlassForm,
  type: InventoryType,
  isCreate: boolean,
  branchOfficeGuid: string
) {
  if (type === 'perfil') {
    return toProfilePayload(data as ProfileForm, isCreate, branchOfficeGuid);
  }
  if (type === 'herraje') {
    return toChapePayload(data as ChapeForm, isCreate, branchOfficeGuid);
  }
  if (type === 'vidrio') {
    return toGlassPayload(data as GlassForm, isCreate, branchOfficeGuid);
  }
  return {};
}
