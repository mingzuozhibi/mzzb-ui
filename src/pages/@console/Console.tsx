import { useTitle } from '#H/useTitle'
import { Tabs } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import Messages from './Messages'

const modules = [
  {
    value: 'SPIDER_CONTENT',
    label: '排名抓取',
  },
  {
    value: 'SPIDER_HISTORY',
    label: '上架抓取',
  },
  {
    value: 'SERVER_DISC',
    label: '碟片日志',
  },
  {
    value: 'SERVER_USER',
    label: '用户日志',
  },
  {
    value: 'SERVER_CORE',
    label: '核心日志',
  },
  {
    value: 'DEFAULT',
    label: '其他日志',
  },
]

export default function Console() {
  const location = useLocation()
  const navigate = useNavigate()

  useTitle('系统日志')

  let activeKey = modules[0].value
  const hash = location.hash
  if (hash.length > 0) {
    activeKey = hash.slice(1)
  }

  function onChange(key: string) {
    navigate(`${location.pathname}#${key}`)
  }

  return (
    <Tabs type="card" activeKey={activeKey} onChange={onChange}>
      {modules.map(({ value, label }) => (
        <Tabs.TabPane key={value} tab={label}>
          <Messages name={value} activeKey={activeKey} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
