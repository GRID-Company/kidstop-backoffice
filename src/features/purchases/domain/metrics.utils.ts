interface VariantMetric {
  condition?: string | null;
  stock?: number | null;
  lastSellDate?: unknown;
  avgDaysInInventory?: number | null;
  wishlistCount?: number | null;
}

export function extractVariantMetrics(
  variantsMetrics: (VariantMetric | null)[] | null | undefined,
  condition: string
) {
  if (!variantsMetrics) return null;

  const variantMetric = variantsMetrics.find((v) => v?.condition === condition);
  if (!variantMetric) return null;

  return {
    stock: variantMetric.stock ?? 0,
    lastSaleDate: (variantMetric.lastSellDate as string | null) ?? null,
    daysInInventory: variantMetric.avgDaysInInventory ?? 0,
    wishlistCount: variantMetric.wishlistCount ?? 0,
  };
}
