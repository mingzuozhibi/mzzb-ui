import React from 'react'
import { Tabs } from 'antd'
import Messages from './Messages'

const modules = [
  {
    moduleName: 'mzzb-disc-spider',
    tableTitle: '排名抓取日志'
  },
  {
    moduleName: 'mzzb-disc-shelfs',
    tableTitle: '上架抓取日志'
  },
  {
    moduleName: 'mzzb-gateway',
    tableTitle: '网关运行日志'
  }
]

export default function Console() {
  return (
    <Tabs defaultActiveKey="1" onChange={undefined}>
      {modules.map(({moduleName, tableTitle}) => (
        <Tabs.TabPane tab={tableTitle} key={moduleName}>
          <Messages moduleName={moduleName} tableTitle={tableTitle}/>
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
