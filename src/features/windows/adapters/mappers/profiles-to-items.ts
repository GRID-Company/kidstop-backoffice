import { SelectProfilesQuery } from '@/lib/api/generated/selectors.generated';

export const mapProfilesToItems = (data: SelectProfilesQuery) =>
  data?.selectProfiles?.data?.map((p) => ({
    value: p.guid,
    label: `${p.sku} | ${p.name} `,
  })) ?? [];
