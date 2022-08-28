import { useAppSelector } from '#A/hooks'
import { useOnceRequest } from '#H/useOnce'
import { fetchResult } from '#U/fetch/fetchResult'
import { Button, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { linkToGroup, linkToGroupEditList } from '#A/links'
import { DiscList } from '#P/@disc-list/disc-list'
import { IGroupDiscs } from '#T/disc'

export default function DiscGroupViewList() {
  const params = useParams<{ key: string }>()
  const groupKey = params.key as string

  const { data: group, ...state } = useOnceRequest(() =>
    fetchResult<IGroupDiscs>(`/api/discGroups/key/${groupKey}/discs`).then((result) => result.data)
  )

  const buttons = []
  const navigate = useNavigate()
  const hasBasic = useAppSelector((state) => state.session.hasBasic)

  if (hasBasic) {
    buttons.push(
      <Space key="S1">
        <Button onClick={() => navigate(linkToGroup(groupKey))}>编辑列表</Button>
        <Button onClick={() => navigate(linkToGroupEditList(groupKey))}>管理碟片</Button>
      </Space>
    )
  }

  const { discs, title, modifyTime: updateOn } = group ?? {}

  return (
    <div className="DiscListOfGroup">
      <DiscList
        name={groupKey}
        rows={discs}
        state={state}
        title={title}
        buttons={buttons}
        updateOn={updateOn}
      />
    </div>
  )
}
