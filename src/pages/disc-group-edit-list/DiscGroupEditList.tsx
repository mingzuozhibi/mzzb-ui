import { useAppDispatch, useAppSelector } from '#A/hooks'
import { MzHeader } from '#C/header/MzHeader'
import { MzTable } from '#C/table/MzTable'
import { useAjax } from '#H/useAjax'
import { useOnceRequest } from '#H/useOnce'
import { fetchResult } from '#U/fetch/fetchResult'
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import './DiscGroupEditList.scss'

import { linkToGroups } from '#A/links'
import { dropToAdds, pushToAdds } from '#F/local'
import { IDisc, IGroupDiscs } from '#T/disc'
import { compareRelease } from '#T/disc-utils'
import { buildColumns, ToAddsList } from '../@to-add-list/to-adds-list'
import { ToAddsTabs } from '../@to-add-list/to-adds-tabs'

export default function DiscGroupEditList() {
  const params = useParams<{ key: string }>()
  const groupKey = params.key as string

  const url = `/api/discGroups/key/${groupKey}/discs`
  const { data: group, ...state } = useOnceRequest(() =>
    fetchResult<IGroupDiscs>(url).then((result) => result.data)
  )

  const dispatch = useAppDispatch()
  const [, doPush] = useAjax<IDisc>('post')
  const [, doDrop] = useAjax<IDisc>('delete')

  function doPushDiscs(groupId: number, discId: number) {
    doPush(`/api/discGroups/${groupId}/discs/${discId}`, '添加碟片到列表', {
      onSuccess(disc: IDisc) {
        if (group !== undefined) {
          dispatch(dropToAdds(disc))
          state.mutate({
            ...group,
            discs: [disc, ...group.discs],
          })
        }
      },
    })
  }

  function doDropDiscs(groupId: number, discId: number) {
    doDrop(`/api/discGroups/${groupId}/discs/${discId}`, '从列表移除碟片', {
      onSuccess(disc: IDisc) {
        if (group !== undefined) {
          dispatch(pushToAdds(disc))
          state.mutate({
            ...group,
            discs: group.discs.filter((e) => e.id !== disc.id),
          })
        }
      },
    })
  }

  const pushColumn = {
    key: 'command',
    title: '添加',
    format: (row: IDisc) => <DownCircleOutlined onClick={() => doPushDiscs(group!.id, row.id)} />,
  }

  const dropColumn = {
    key: 'command',
    title: '移除',
    format: (row: IDisc) => <UpCircleOutlined onClick={() => doDropDiscs(group!.id, row.id)} />,
  }

  const toAdds = useAppSelector((state) => state.local.toAdds)
  const navigate = useNavigate()

  return (
    <div className="DiscGroupEditList" style={{ maxWidth: 650 }}>
      <MzHeader title={{ prefix: '管理碟片', suffix: group?.title }} state={state} />
      <ToAddsTabs toAdds={toAdds} />
      <ToAddsList toAdds={toAdds} column={pushColumn} />
      {group && (
        <MzTable
          tag="editlist"
          rows={group.discs}
          cols={buildColumns(dropColumn)}
          title={group.title}
          defaultSort={compareRelease}
          extraCaption={
            <Button.Group>
              <Button onClick={() => navigate(linkToGroups(`/${group.key}`))}>编辑</Button>
              <Button onClick={() => navigate(linkToGroups(`/${group.key}/discs`))}>浏览</Button>
            </Button.Group>
          }
        />
      )}
    </div>
  )
}
