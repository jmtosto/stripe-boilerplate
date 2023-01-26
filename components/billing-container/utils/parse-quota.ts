export function parseQuota(quota: number | string): string {
  quota = Number(quota)

  if (quota === -1) return '∞'

  if (quota < 1000) {
    return quota.toString()
  } else if (quota < 1000000) {
    return `${Math.round(quota / 1000)}k`
  } else if (quota < 1000000000) {
    return `${Math.round(quota / 1000000)}m`
  } else if (quota < 1000000000000) {
    return `${Math.round(quota / 1000000000)}b`
  } else {
    return `${Math.round(quota / 1000000000000)}t`
  }
}
