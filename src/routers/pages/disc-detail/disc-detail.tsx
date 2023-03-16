import { useAppSelector } from '#CA/hooks'
import { MzHeader } from '#CC/header/MzHeader'
import { useLocal } from '#CH/useLocal'
import { useData } from '#CH/useOnce'
import { Tabs } from 'antd'

import { IDisc } from '#DT/disc'
import { discTitle } from '#DU/disc-comps'

import { DiscEdit } from '#RC/@disc-items/disc-edit'
import { DiscOwns } from '#RC/@disc-items/disc-owns'
import { DiscRank } from '#RC/@disc-items/disc-rank'
import { DiscView } from '#RC/@disc-items/disc-view'

interface Props {
  apiUrl: string
}

export function DiscDetail({ apiUrl }: Props) {
  const { data: disc, ...state } = useData<IDisc>(apiUrl)

  const hasBasic = useAppSelector((state) => state.session.hasBasic)
  const [tabKey, setTabKey] = useLocal<string>('discdetail-tabkey', 'disc-view')

  return (
    <div className="disc-detail" style={{ maxWidth: 650 }}>
      <MzHeader title={disc && discTitle(disc)} state={state} />
      {disc && (
        <Tabs
          type="card"
          activeKey={hasBasic ? tabKey : 'disc-view'}
          onChange={setTabKey}
          items={[
            {
              label: '查看碟片',
              key: 'disc-view',
              children: <DiscView disc={disc} />,
            },
            {
              label: '编辑碟片',
              key: 'disc-edit',
              children: <DiscEdit disc={disc} setDisc={state.mutate} />,
            },
            {
              label: '更新排名',
              key: 'disc-rank',
              children: <DiscRank disc={disc} setDisc={state.mutate} />,
            },
            {
              label: '所属列表',
              key: 'disc-owns',
              children: <DiscOwns disc={disc} />,
            },
          ].filter((e) => hasBasic || ['disc-view'].includes(e.key))}
        />
      )}
    </div>
  )
}
