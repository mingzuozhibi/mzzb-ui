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
