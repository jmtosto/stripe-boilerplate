export function parsePlanName(planName: string): string {
  return planName.replace('NotifyLog - ', '')
}
