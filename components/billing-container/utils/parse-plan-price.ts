export function parsePlanPrice(unitAmount: number): string {
  unitAmount = unitAmount / 100
  return unitAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}
