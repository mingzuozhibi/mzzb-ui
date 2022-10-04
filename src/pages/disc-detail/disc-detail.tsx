import { useAppSelector } from '#A/hooks'
import { MzHeader } from '#C/header/MzHeader'
import { useLocal } from '#H/useLocal'
import { useOnceRequest } from '#H/useOnce'
import { fetchResult } from '#U/fetch/fetchResult'
import { Tabs } from 'antd'

import { IDisc } from '#T/disc'
import { discTitle } from '#T/disc-comps'

import { DiscEdit } from './disc-edit'
import { DiscRank } from './disc-rank'
import { DiscView } from './disc-view'

interface Props {
  url: string
}

export function DiscDetail({ url }: Props) {
  const { data: disc, ...state } = useOnceRequest(() =>
    fetchResult<IDisc>(url).then((result) => result.data)
  )

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
