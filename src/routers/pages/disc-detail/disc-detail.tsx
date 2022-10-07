import { useAppSelector } from '#CA/hooks'
import { MzHeader } from '#CC/header/MzHeader'
import { useLocal } from '#CH/useLocal'
import { useData } from '#CH/useOnce'
import { Tabs } from 'antd'

import { IDisc } from '#DT/disc'
import { discTitle } from '#DU/disc-comps'
import { DiscEdit } from './disc-edit'
import { DiscRank } from './disc-rank'
import { DiscView } from './disc-view'

interface Props {
  apiUrl: string
}

export function DiscDetail({ apiUrl }: Props) {
  const { data: disc, ...state } = useData<IDisc>(apiUrl)

  const hasBasic = useAppSelector((state) => state.session.hasBasic)
  const [tabKey, setTabKey] = useLocal<string>('discdetail-tabkey', 'view-disc')

  return (
    <div className="disc-detail" style={{ maxWidth: 650 }}>
      <MzHeader title={disc && discTitle(disc)} state={state} />
      {disc &&
        (hasBasic ? (
          <Tabs
            type="card"
            activeKey={tabKey}
            onChange={setTabKey}
            items={[
              {
                label: '查看碟片',
                key: 'view-disc',
                children: <DiscView disc={disc} />,
              },
              {
                label: '编辑碟片',
                key: 'edit-disc',
                children: <DiscEdit disc={disc} setDisc={state.mutate} />,
              },
              {
                label: '更新排名',
                key: 'edit-edit-rank',
                children: <DiscRank disc={disc} setDisc={state.mutate} />,
              },
            ]}
          />
        ) : (
          <DiscView disc={disc} />
        ))}
    </div>
  )
}
