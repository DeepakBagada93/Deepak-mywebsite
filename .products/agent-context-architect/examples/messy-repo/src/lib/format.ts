export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
