import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons'
import { Link, useParams } from 'react-router-dom'
import { Tabs } from 'antd'
import './DiscGroupItems.scss'

import { useData } from '../../../hooks/useData'
import { useAjax } from '../../../hooks/useAjax'
import { formatTimeout } from '../../../funcs/format'
import { composeCompares } from '../../../funcs/compare'
import { CustomHeader } from '../../../comps/CustomHeader'
import { Column, Table } from '../../../comps/@table/Table'

import { compareSurp, compareTitle, discTitle } from '../../@funcs'
import { InjectToAdds, injectToAdds } from '../../@inject'
import { Disc, DiscGroup } from '../../@types'
import SearchDisc from './SearchDisc'
import CreateDisc from './CreateDisc'

interface IGroup extends DiscGroup {
  discs: Disc[]
}

const columns = 'id,asin,title,titlePc,surplusDays'

export default injectToAdds(DiscGroupItems)

function DiscGroupItems(props: InjectToAdds) {
  const { toAdds, pushToAdds, dropToAdds } = props
  const params = useParams<{ key: string }>()

  const [{ error, data: group }, handler, { update: setGroup }] = useData<IGroup>(
    `/api/discGroups/key/${params.key}/discs?discColumns=${columns}`
  )
  const [, pushDisc] = useAjax<Disc>('post')
  const [, dropDisc] = useAjax<Disc>('delete')

  function doPushDisc(discGroupId: number, discId: number) {
    pushDisc(`/api/discGroups/${discGroupId}/discs/${discId}`, '添加碟片到列表', {
      onSuccess(disc: Disc) {
        dropToAdds(disc)
        setGroup((draft) => {
          draft.discs.unshift(disc)
        })
      },
    })
  }

  function doDropDisc(discGroupId: number, discId: number) {
    dropDisc(`/api/discGroups/${discGroupId}/discs/${discId}`, '从列表移除碟片', {
      onSuccess(disc: Disc) {
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
      format: (t: Disc) => <FileAddOutlined onClick={() => doPushDisc(group!.id, t.id)} />,
    }
  }

  function getDropCommand() {
    return {
      key: 'command',
      title: '移除',
      format: (t: Disc) => <DeleteOutlined onClick={() => doDropDisc(group!.id, t.id)} />,
    }
  }

  const title = group ? `管理碟片：${group.title}` : '载入中'

  return (
    <div className="DiscGroupItems">
      <CustomHeader header="管理碟片" title={title} error={error} handler={handler} />
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
          <Table rows={toAdds} cols={getColumns(getPushCommand())} title="待选列表" />
          <Table
            rows={group.discs}
            cols={getColumns(getDropCommand())}
            title={group.title}
            extraCaption={`更新于${formatTimeout(group.modifyTime)}前`}
            defaultSort={composeCompares([compareSurp, compareTitle])}
          />
        </>
      )}
    </div>
  )
}

function getColumns(extraColumn: Column<Disc>): Column<Disc>[] {
  return [
    {
      key: 'asin',
      title: 'ASIN',
      format: (t) => t.asin,
      compare: (a, b) => a.asin.localeCompare(b.asin),
    },
    {
      key: 'surp',
      title: '天数',
      format: (t) => `${t.surplusDays}天`,
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

function formatTitle(disc: Disc) {
  return <Link to={`/discs/${disc.id}`}>{discTitle(disc)}</Link>
}
