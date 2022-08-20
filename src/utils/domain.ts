export function isJustUpdated(time?: number) {
  return time && Date.now() - time < 3600000 // 1.0 hour
}

export function isSlowUpdated(time?: number) {
  return time && Date.now() - time > 21960000 // 6.1 hour
}

export function isEmpty(text?: string): text is undefined {
  return text === undefined || text.length === 0
}
