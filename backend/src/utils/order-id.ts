/**
 * Generates a unique order ID in the format: ORD-{timestamp36}-{random4}
 * Example: ORD-lzx4abc-7d3f
 */
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}
