import dayjs from 'dayjs'

export function formatDateTime(time: number) {
  return dayjs(time).format('YYYY-DD-MM HH:mm:ss')
}

export function formatDate(time: number) {
  return dayjs(time).format('YYYY-DD-MM')
}

export function formatTime(time: number) {
  return dayjs(time).format('HH:mm:ss')
}
