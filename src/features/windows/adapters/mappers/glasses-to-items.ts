import { SelectGlassesQuery } from '@/lib/api/generated/selectors.generated';

export const mapGlassesToItems = (data: SelectGlassesQuery) =>
  data?.selectGlasses?.data?.map((p) => ({
    value: p.guid,
    label: `${p.sku} | ${p.name}, ${p.thickness} `,
  })) ?? [];
