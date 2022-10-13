import { useAppDispatch, useAppSelector } from '#CA/hooks'
import { MzHeader } from '#CC/header/MzHeader'
import { MzColumn, MzTable } from '#CC/table/MzTable'
import { useAjax } from '#CH/useAjax'
import { useData } from '#CH/useOnce'
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './DiscGroupEditList.scss'

import { dropToAdds, pushToAdds } from '#DF/local'
import { IDisc, IGroupDiscs } from '#DT/disc'
import { compareRelease } from '#DU/disc-utils'
import { buildColumns, ToAddsList } from '#RC/@to-add-list/to-adds-list'
import { ToAddsTabs } from '#RC/@to-add-list/to-adds-tabs'
import { apiToGroups, linkToGroups } from '#RU/links'

export default function DiscGroupEditList() {
  const params = useParams<{ key: string }>()
  const groupKey = params.key as string

  const apiUrl = apiToGroups(`/key/${groupKey}/discs`)
  const { data: group, ...state } = useData<IGroupDiscs>(apiUrl)

  const dispatch = useAppDispatch()
  const toAdds = useAppSelector((state) => state.local.toAdds)

  const [, doPush] = useAjax<IDisc>('post')
  function doPushDiscs(groupId: number, discId: number) {
    doPush(apiToGroups(`/${groupId}/discs/${discId}`), '添加碟片到列表', {
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

  const pushColumn: MzColumn<IDisc> = {
    key: 'command',
    title: '添加',
    format: () => <DownCircleOutlined />,
    tdClick: (row) => doPushDiscs(group!.id, row.id),
  }

  const [, doDrop] = useAjax<IDisc>('delete')
  const doDropDiscs = useCallback(
    (groupId: number, discId: number) => {
      doDrop(apiToGroups(`/${groupId}/discs/${discId}`), '从列表移除碟片', {
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
    },
    [doDrop, dispatch, state.mutate, group]
  )

  const editCols = useMemo(
    () =>
      buildColumns({
        key: 'command',
        title: '移除',
        format: () => <UpCircleOutlined />,
        tdClick: (row: IDisc) => doDropDiscs(group!.id, row.id),
      }),
    [doDropDiscs, group]
  )

  const navigate = useNavigate()
  const editExtra = useMemo(
    () => (
      <Button.Group>
        <Button onClick={() => navigate(linkToGroups(`/${group?.key}`))}>编辑</Button>
        <Button onClick={() => navigate(linkToGroups(`/${group?.key}/discs`))}>浏览</Button>
      </Button.Group>
    ),
    [navigate, group]
  )

  return (
    <div className="DiscGroupEditList" style={{ maxWidth: 650 }}>
      <MzHeader title={{ prefix: '管理碟片', suffix: group?.title }} state={state} />
      <ToAddsTabs toAdds={toAdds} />
      <ToAddsList toAdds={toAdds} column={pushColumn} showEmpty={false} />
      {group && (
        <MzTable
          tag="editlist"
          rows={group.discs}
          cols={editCols}
          title={group.title}
          usePage={true}
          defaultSort={compareRelease}
          extraCaption={editExtra}
        />
      )}
    </div>
  )
}
