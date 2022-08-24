import dayjs from 'dayjs'

const times: [number, string][] = [[1000, '秒']]
times.unshift([times[0][0] * 60, '分'])
times.unshift([times[0][0] * 60, '时'])
times.unshift([times[0][0] * 24, '日'])

export function formatTimeout(time?: number) {
  if (time == undefined) return '---'
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

export function formatTime(time: number) {
  return dayjs(time).format('YYYY-DD-MM HH:mm:ss')
}

export function formatNumber(input: number, format: string) {
  const numstr = input.toString()
  let result = ''
  let indexFormat = format.length - 1
  let indexNumber = numstr.length - 1
  while (indexFormat >= 0 && indexNumber >= 0) {
    if (/[*#0]/.test(format[indexFormat])) {
      result = numstr[indexNumber] + result
      indexNumber--
      indexFormat--
    } else {
      result = format[indexFormat] + result
      indexFormat--
    }
  }
  if (indexNumber >= 0) {
    result = numstr.slice(0, indexNumber + 1) + result
  }
  while (indexFormat >= 0) {
    if (/[#]/.test(format[indexFormat])) {
      break
    }
    result = format[indexFormat] + result
    indexFormat--
  }
  return /^,.*/.test(result) ? result.slice(1, result.length) : result
}
