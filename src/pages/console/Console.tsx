import { useTitle } from '#H/useTitle'
import { Tabs } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import Messages from './Messages'

import { msgModules } from '#A/metas'

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
    <Tabs type="card" activeKey={activeKey} onChange={onChange}>
      {msgModules.map(({ value, label }) => (
        <Tabs.TabPane key={value} tab={label}>
          <Messages name={value} activeKey={activeKey} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
