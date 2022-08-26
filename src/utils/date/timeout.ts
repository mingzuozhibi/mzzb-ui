import dayjs from 'dayjs'

const times: [number, string][] = [[1000, '秒']]
times.unshift([times[0][0] * 60, '分'])
times.unshift([times[0][0] * 60, '时'])
times.unshift([times[0][0] * 24, '日'])

export function formatTimeout(time: number) {
  let timeout = Date.now() - time
  if (timeout < 0) return dayjs(time).toNow()
  if (timeout > times[0][0] * 7) return dayjs(time).fromNow()

  const result: string[] = []
  for (const [milis, name] of times) {
    const num = Math.floor(timeout / milis)
    if (num > 0 || result.length) {
      result.push(`${num}${name}`)
      if (result.length >= 2) break
    }
    timeout %= milis
  }
  return result.join('') + '前'
}
