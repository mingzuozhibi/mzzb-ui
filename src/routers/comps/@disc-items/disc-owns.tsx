import { useAppDispatch, useAppSelector } from '#CA/hooks'
import { MzColumn, MzTable } from '#CC/table/MzTable'
import { useAjax } from '#CH/useAjax'
import { useData } from '#CH/useOnce'
import { Button, Space } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './disc-owns.scss'

import { dropToAdds, pushToAdds } from '#DF/local'
import { IDisc, IGroup } from '#DT/disc'
import { compareGroups, formatUpdate } from '#DU/group-utils'
import { apiToGroups, linkToGroups } from '#RU/links'

interface Props {
  disc: IDisc
}

export function DiscOwns({ disc }: Props) {
  const apiUrl = apiToGroups(`/asin/${disc.asin}`)
  const { data: groups, ...state } = useData<IGroup[]>(apiUrl, {
    refreshDeps: [disc],
  })

  const dispatch = useAppDispatch()
  const toAdds = useAppSelector((state) => state.local.toAdds)
  const toAddsButton =
    toAdds.find((e) => e.asin === disc.asin) != null ? (
      <Button onClick={() => dispatch(dropToAdds(disc))}>从待选列表移除</Button>
    ) : (
      <Button onClick={() => dispatch(pushToAdds(disc))}>添加到待选列表</Button>
    )

  const groupIds = groups?.map((g) => g.id)
  const [list, setList] = useState<IGroup[]>()

  const [isGet, doGet] = useAjax<IGroup[]>('get')
  const openModal = () => {
    doGet(apiToGroups(`?filter=top&withCount=false`), '', {
      onSuccess(data) {
        setList(data.filter((g) => groupIds?.includes(g.id) !== true))
      },
    })
  }

  const [isPush, doPush] = useAjax<IDisc>('post')
  const pushToGroup = (group: IGroup) => {
    doPush(apiToGroups(`/${group.id}/discs/${disc.id}`), '添加碟片到列表', {
      onSuccess() {
        setList(list?.filter((g) => g.id !== group.id))
        state.mutate([group, ...(groups ?? [])])
      },
    })
  }

  const [isDrop, doDrop] = useAjax<IDisc>('delete')
  const dropFromGroup = (group: IGroup) => {
    doDrop(apiToGroups(`/${group.id}/discs/${disc.id}`), '从列表移除碟片', {
      onSuccess() {
        setList([group, ...(list ?? [])])
        state.mutate(groups?.filter((g) => g.id !== group.id))
      },
    })
  }

  return (
    <div className="disc-owns">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          {toAddsButton}
          <Button loading={isGet} onClick={openModal}>
            添加到其他列表
          </Button>
        </Space>
        <MzTable
          tag="discowns"
          rows={groups}
          cols={buildColumns({
            key: 'command',
            title: '管理操作',
            format: (row) => <a onClick={() => dropFromGroup(row)}>从列表移除</a>,
          })}
          defaultSort={compareGroups}
        />
        {list && (
          <MzTable
            tag="discowns"
            rows={list}
            cols={buildColumns({
              key: 'command',
              title: '管理操作',
              format: (row) => <a onClick={() => pushToGroup(row)}>添加到列表</a>,
            })}
            defaultSort={compareGroups}
          />
        )}
      </Space>
    </div>
  )
}

function buildColumns(extraColumn: MzColumn<IGroup>): MzColumn<IGroup>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (row, idx) => idx + 1,
    },
    {
      key: 'title',
      title: '列表标题',
      format: (row) => <Link to={linkToGroups(`/${row.key}/discs`)}>{row.title}</Link>,
    },
    {
      key: 'update',
      title: '是否更新',
      format: formatUpdate,
    },
    extraColumn,
  ]
}
