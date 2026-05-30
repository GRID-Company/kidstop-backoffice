export function getCustomerDisplayName(
  customerName: string | null | undefined,
  kioskName: string | null | undefined
): string {
  return kioskName ?? customerName ?? 'Cliente anónimo';
}

export function getCustomerDisplayEmail(
  customerEmail: string | null | undefined,
  kioskEmail: string | null | undefined
): string | null {
  return kioskEmail ?? customerEmail ?? null;
}
