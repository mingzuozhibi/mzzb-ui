import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons'
import { Button, Space, Tabs } from 'antd'
import dayjs from 'dayjs'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './DiscGroupItems.scss'

import { linkToDisc, linkToGroup, linkToGroupViewList } from '#A/routes'
import { MzHeader } from '#C/header/MzHeader'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { useAjax } from '#H/useAjax'
import { useData } from '#H/useData'
import { useLocal } from '#H/useLocal'
import { compareSurp, compareTitle, discTitle } from '#P/@funcs'
import { IDisc, IGroupItems } from '#T/disc'
import { composeCompares } from '#U/compare'

import CreateDisc from './CreateDisc'
import SearchDisc from './SearchDisc'

export default function DiscGroupItems() {
  const navigate = useNavigate()
  const params = useParams<{ key: string }>()

  const [{ error, data: group }, handler, { update: setGroup }] = useData<IGroupItems>(
    `/api/discGroups/key/${params.key}/discs`
  )

  const [, pushDisc] = useAjax<IDisc>('post')
  const [, dropDisc] = useAjax<IDisc>('delete')

  const [toAdds, setToAdds] = useLocal<IDisc[]>('local-toadds', [])

  function pushToAdds(disc: IDisc) {
    setToAdds([disc, ...toAdds])
  }

  function dropToAdds(disc: IDisc) {
    setToAdds(toAdds.filter((e) => e.id !== disc.id))
  }

  function doPushDisc(discGroupId: number, discId: number) {
    pushDisc(`/api/discGroups/${discGroupId}/discs/${discId}`, '添加碟片到列表', {
      onSuccess(disc: IDisc) {
        dropToAdds(disc)
        setGroup((draft) => {
          draft.discs.unshift(disc)
        })
      },
    })
  }

  function doDropDisc(discGroupId: number, discId: number) {
    dropDisc(`/api/discGroups/${discGroupId}/discs/${discId}`, '从列表移除碟片', {
      onSuccess(disc: IDisc) {
        pushToAdds(disc)
        setGroup((draft) => {
          draft.discs = draft.discs.filter((e) => e.id !== disc.id)
        })
      },
    })
  }

  function getPushCommand() {
    return {
      key: 'command',
      title: '添加',
      format: (row: IDisc) => <FileAddOutlined onClick={() => doPushDisc(group!.id, row.id)} />,
    }
  }

  function getDropCommand() {
    return {
      key: 'command',
      title: '移除',
      format: (row: IDisc) => <DeleteOutlined onClick={() => doDropDisc(group!.id, row.id)} />,
    }
  }

  const title = group ? `管理碟片：${group.title}` : '载入中'

  const extraCaption = group ? (
    <Space>
      <span>更新于 {dayjs(group.modifyTime).fromNow()}</span>
      <Button onClick={() => navigate(linkToGroup(group.key))}>编辑列表</Button>
      <Button onClick={() => navigate(linkToGroupViewList(group.key))}>浏览碟片</Button>
    </Space>
  ) : null

  return (
    <div className="DiscGroupItems">
      <MzHeader header="管理碟片" title={title} error={error} handler={handler} />
      {group && (
        <>
          <Tabs type="card">
            <Tabs.TabPane tab="查询碟片" key="1">
              <SearchDisc theDiscs={group.discs} addDiscs={toAdds} pushToAdds={pushToAdds} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="手动创建" key="2">
              <CreateDisc pushToAdds={pushToAdds} />
            </Tabs.TabPane>
          </Tabs>
          <MzTable rows={toAdds} cols={getColumns(getPushCommand())} title="待选列表" />
          <MzTable
            rows={group.discs}
            cols={getColumns(getDropCommand())}
            title={group.title}
            extraCaption={extraCaption}
            defaultSort={composeCompares([compareSurp, compareTitle])}
          />
        </>
      )}
    </div>
  )
}

function getColumns(extraColumn: MzColumn<IDisc>): MzColumn<IDisc>[] {
  return [
    {
      key: 'asin',
      title: 'ASIN',
      format: (row) => row.asin,
      compare: (a, b) => a.asin.localeCompare(b.asin),
    },
    {
      key: 'surp',
      title: '天数',
      format: (row) => `${row.surplusDays}天`,
      compare: composeCompares([compareSurp, compareTitle]),
    },
    {
      key: 'title',
      title: '碟片标题',
      format: formatTitle,
      compare: compareTitle,
    },
    extraColumn,
  ]
}

function formatTitle(row: IDisc) {
  return <Link to={linkToDisc(row.id)}>{discTitle(row)}</Link>
}
