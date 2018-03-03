import * as React from 'react'
import { Timer } from '../lib/timer'

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

export function formatTimeout(time: number) {
  if (time) {
    return (
      <Timer
        time={time}
        timeout={20000}
        render={(state => `${state.hour}时${state.minute}分前`)}
      />
    )
  } else {
    return '从未更新'
  }
}
