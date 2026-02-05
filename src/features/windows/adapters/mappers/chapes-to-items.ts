import { SelectChapesQuery } from '@/lib/api/generated/selectors.generated';

export const mapChapesToItems = (data: SelectChapesQuery) =>
  data?.selectChapes?.data?.map((p) => ({
    value: p.guid,
    label: `${p.sku} | ${p.name}, ${p.line} `,
  })) ?? [];
