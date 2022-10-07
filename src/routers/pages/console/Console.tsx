import { useTitle } from '#CH/useTitle'
import { Tabs } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

import { msgModules } from '#DT/metas'
import Messages from './Messages'

export default function Console() {
  const location = useLocation()
  const navigate = useNavigate()

  useTitle('系统日志')

  let activeKey = msgModules[0].value
  const hash = location.hash
  if (hash.length > 0) {
    activeKey = hash.slice(1)
  }

  function onChange(key: string) {
    navigate(`${location.pathname}#${key}`)
  }

  return (
    <Tabs
      type="card"
      activeKey={activeKey}
      onChange={onChange}
      items={msgModules.map(({ value, label }) => ({
        key: value,
        label: label,
        children: <Messages name={value} activeKey={activeKey} />,
      }))}
    />
  )
}
