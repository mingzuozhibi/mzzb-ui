import dayjs from 'dayjs'

export function formatDateTime(time: number) {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

export function formatYYMM(time: number) {
  return dayjs(time).format('YYYY/MM')
}

export function formatMMDD(time: number) {
  return dayjs(time).format('MM/DD')
}

export function formatDate(time: number) {
  return dayjs(time).format('YYYY-MM-DD')
}

export function formatTime(time: number) {
  return dayjs(time).format('HH:mm:ss')
}
