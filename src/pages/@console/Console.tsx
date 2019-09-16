import React from 'react'
import { Tabs } from 'antd'
import Messages from './Messages'

const modules = [
  {
    moduleName: 'mzzb-disc-spider',
    tableTitle: '排名日志'
  },
  {
    moduleName: 'mzzb-disc-shelfs',
    tableTitle: '上架日志'
  },
  {
    moduleName: 'mzzb-gateway',
    tableTitle: '网关日志'
  }
]

export default function Console() {
  return (
    <Tabs type="card" defaultActiveKey="1" onChange={undefined}>
      {modules.map(({moduleName, tableTitle}) => (
        <Tabs.TabPane key={moduleName} tab={tableTitle}>
          <Messages moduleName={moduleName} tableTitle={tableTitle}/>
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
