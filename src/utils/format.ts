export const formatNumber = (numbez: number, format: string) => {
  const numstr = numbez.toString()
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
    result = numstr.substr(0, indexNumber + 1) + result
  }
  while (indexFormat >= 0) {
    if (/[#]/.test(format[indexFormat])) {
      break
    }
    result = format[indexFormat] + result
    indexFormat--
  }
  return /^,.*/.test(result) ? result.substr(1, result.length - 1) : result
}

export const formatTimeout = (timestamp: number, message?: string) => {
  if (timestamp === 0) {
    return message
  } else {
    const millis = new Date().getTime() - timestamp
    const minutes = Math.floor(millis / 60000)
    const hour = Math.floor(minutes / 60)
    const minute = Math.floor(minutes % 60)
    return `${hour}时${minute}分前`
  }
}
