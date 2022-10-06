function hours(hour: number) {
  return hour * 3600 * 1000
}

export function isJustUpdate(time: number | undefined, hour: number) {
  if (time === undefined) return false
  return Date.now() - time < hours(hour)
}

export function isLazyUpdate(time: number | undefined, hour: number) {
  if (time === undefined) return false
  return Date.now() - time > hours(hour)
}
