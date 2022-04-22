import { useTitle } from '##/hooks'
import { Tabs } from 'antd'
import Messages from './Messages'

const modules = [
  {
    moduleName: 'mzzb-disc-spider',
    tableTitle: '排名抓取',
  },
  {
    moduleName: 'mzzb-disc-shelfs',
    tableTitle: '上架抓取',
  },
  {
    moduleName: 'mzzb-server',
    tableTitle: '核心模块',
  },
]

export default function Console() {
  useTitle('系统日志')

  return (
    <Tabs type="card" defaultActiveKey="1" onChange={undefined}>
      {modules.map(({ moduleName, tableTitle }) => (
        <Tabs.TabPane key={moduleName} tab={tableTitle}>
          <Messages moduleName={moduleName} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
