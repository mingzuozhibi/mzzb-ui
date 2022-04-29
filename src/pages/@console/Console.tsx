import { useTitle } from '##/hooks'
import { Tabs } from 'antd'
import { useLocation } from 'react-router-dom'
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
  useTitle('系统日志')

  function onChange(activeKey: string) {
    window.location.hash = activeKey
  }

  return (
    <Tabs type="card" activeKey={getDefaultValue()} onChange={onChange}>
      {modules.map(({ value, label }) => (
        <Tabs.TabPane key={value} tab={label}>
          <Messages name={value} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}

function getDefaultValue() {
  const value = window.location.hash
  if (value.length > 0) {
    return value.substring(1)
  } else {
    return modules[0].value
  }
}
