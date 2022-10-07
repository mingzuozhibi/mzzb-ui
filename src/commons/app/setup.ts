import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import { enableMapSet } from 'immer'

export function setupImmer() {
  enableMapSet()
}

export function setupDayjs() {
  dayjs.extend(relativeTime)
  dayjs.locale('zh-cn')
}
