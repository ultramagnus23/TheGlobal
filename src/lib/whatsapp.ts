/** Builds a wa.me deep link pre-filled with context, per §5.3. */
export function buildWhatsAppLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
