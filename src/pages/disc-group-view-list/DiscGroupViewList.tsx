import { useAppSelector } from '#A/hooks'
import { linkToGroup, linkToGroupEditList } from '#A/links'
import { useOnceRequest } from '#H/useOnce'
import { IGroupItems } from '#T/disc'
import { fetchResult } from '#U/fetchResult'
import { Button, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { DiscList } from '../disc-list/disc-list'

export default function DiscGroupViewList() {
  const params = useParams<{ key: string }>()
  const key = params.key as string

  const { data: group, ...state } = useOnceRequest(() =>
    fetchResult<IGroupItems>(`/api/discGroups/key/${params.key!}/discs`).then(
      (result) => result.data
    )
  )

  const buttons = []
  const navigate = useNavigate()
  const hasBasic = useAppSelector((state) => state.session.hasBasic)

  if (hasBasic) {
    buttons.push(
      <Space key="S1">
        <Button onClick={() => navigate(linkToGroup(key))}>编辑列表</Button>
        <Button onClick={() => navigate(linkToGroupEditList(key))}>管理碟片</Button>
      </Space>
    )
  }

  const { discs, title = '载入中', modifyTime } = group ?? {}

  return (
    <div className="DiscListOfGroup">
      <DiscList
        name={key}
        rows={discs}
        state={state}
        title={title}
        buttons={buttons}
        updateOn={modifyTime}
      />
    </div>
  )
}
