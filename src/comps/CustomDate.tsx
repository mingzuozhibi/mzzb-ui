import React from 'react'
import { formatNumber } from '../funcs/format'

interface Props {
  time: number
  addWarp?: boolean
  hasYear?: boolean
}

function getFormatString(_d: Date) {
  const year = formatNumber(_d.getFullYear(), '0000')
  const month = formatNumber(_d.getMonth() + 1, '00')
  const date = formatNumber(_d.getDate(), '00')
  const hour = formatNumber(_d.getHours(), '00')
  const minute = formatNumber(_d.getMinutes(), '00')
  const second = formatNumber(_d.getSeconds(), '00')
  return {year, month, date, hour, minute, second}
}

export function CustomDate({time, hasYear = false, addWarp = true}: Props) {
  const {year, month, date, hour, minute, second} = getFormatString(new Date(time))
  const dateTextOfNoYear = `${month}/${date}`
  const dateText = `${year}/${month}/${date}`
  const timeText = `${hour}:${minute}:${second}`
  const splitObj = addWarp ? <br/> : ' '
  return <>{hasYear ? dateText : dateTextOfNoYear}{splitObj}{timeText}</>
}
