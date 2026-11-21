/** "Rs. 1,200" -> 1200 */
export function toAmount(text: string): number {
  const match = text.replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : Number.NaN;
}
