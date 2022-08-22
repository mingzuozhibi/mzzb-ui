import { useAppSelector } from '#A/hooks'
import { useOnceRequest } from '#H/useOnce'
import { IGroupItems } from '#T/disc'
import { linkToGroup, linkToGroupEditList } from '#T/link'
import { fetchResult } from '#U/fetchResult'
import { Button, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { DiscList } from './disc-list'

export default function DiscListOfGroup() {
  const navigate = useNavigate()
  const params = useParams<{ key: string }>()
  const hasBasic = useAppSelector((state) => state.session.hasBasic)

  const { data: group, ...state } = useOnceRequest(() =>
    fetchResult<IGroupItems>(`/api/discGroups/key/${params.key!}/discs`).then(
      (result) => result.data
    )
  )

  if (group === undefined) {
    return null
  }

  const { key, discs, title, modifyTime } = group

  const buttons = []

  if (hasBasic) {
    buttons.push(
      <Space>
        <Button key="1" onClick={() => navigate(linkToGroup(key))}>
          编辑列表
        </Button>
        <Button key="2" onClick={() => navigate(linkToGroupEditList(key))}>
          管理碟片
        </Button>
      </Space>
    )
  }

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
