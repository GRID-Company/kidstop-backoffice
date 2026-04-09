export function getCustomerDisplayName(
  customerName: string | null | undefined,
  kioskName: string | null | undefined
): string {
  return customerName ?? kioskName ?? 'Cliente anónimo';
}

export function getCustomerDisplayEmail(
  customerEmail: string | null | undefined,
  kioskEmail: string | null | undefined
): string | null {
  return customerEmail ?? kioskEmail ?? null;
}
