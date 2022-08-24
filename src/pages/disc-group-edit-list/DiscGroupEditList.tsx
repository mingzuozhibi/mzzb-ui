import { MyColumn, MyTable } from '#C/table/MyTable'
import { MzTopbar } from '#C/topbar/MzTopbar'
import { useAjax } from '#H/useAjax'
import { useLocal } from '#H/useLocal'
import { useOnceRequest } from '#H/useOnce'
import { fetchResult } from '#U/fetchResult'
import { formatTimeout } from '#U/format'
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons'
import { Button, Space, Tabs } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './DiscGroupEditList.scss'

import { linkToDisc, linkToGroup, linkToGroupViewList } from '#A/links'
import { CreateDisc } from '#P/@to-add-list/create-disc'
import { SearchDisc } from '#P/@to-add-list/search-disc'
import { IDisc, IGroupItems } from '#T/disc'
import { compareRelease, compareTitle, discTitle } from '#T/disc-utils'

export default function DiscGroupEditList() {
  const params = useParams<{ key: string }>()
  const groupKey = params.key as string

  const { data: group, ...state } = useOnceRequest(() =>
    fetchResult<IGroupItems>(`/api/discGroups/key/${groupKey}/discs`).then((result) => result.data)
  )

  const [, pushDisc] = useAjax<IDisc>('post')
  const [, dropDisc] = useAjax<IDisc>('delete')

  const [toAdds, setToAdds] = useLocal<IDisc[]>('local-toadds', [])

  function handlePushAdds(disc: IDisc) {
    setToAdds([disc, ...toAdds])
  }

  function handleDropAdds(disc: IDisc) {
    setToAdds(toAdds.filter((e) => e.id !== disc.id))
  }

  function handlePushDisc(discGroupId: number, discId: number) {
    pushDisc(`/api/discGroups/${discGroupId}/discs/${discId}`, '添加碟片到列表', {
      onSuccess(disc: IDisc) {
        if (group !== undefined) {
          handleDropAdds(disc)
          state.mutate({
            ...group,
            discs: [disc, ...group.discs],
          })
        }
      },
    })
  }

  function handleDropDisc(discGroupId: number, discId: number) {
    dropDisc(`/api/discGroups/${discGroupId}/discs/${discId}`, '从列表移除碟片', {
      onSuccess(disc: IDisc) {
        if (group !== undefined) {
          handlePushAdds(disc)
          state.mutate({
            ...group,
            discs: group.discs.filter((e) => e.id !== disc.id),
          })
        }
      },
    })
  }

  function getPushCommand() {
    return {
      key: 'command',
      title: '添加',
      format: (row: IDisc) => <FileAddOutlined onClick={() => handlePushDisc(group!.id, row.id)} />,
    }
  }

  function getDropCommand() {
    return {
      key: 'command',
      title: '移除',
      format: (row: IDisc) => <DeleteOutlined onClick={() => handleDropDisc(group!.id, row.id)} />,
    }
  }

  const navigate = useNavigate()
  const extraCaption = group ? (
    <Space>
      <span>更新于{formatTimeout(group.modifyTime)}</span>
      <Button onClick={() => navigate(linkToGroup(group.key))}>编辑列表</Button>
      <Button onClick={() => navigate(linkToGroupViewList(group.key))}>浏览碟片</Button>
    </Space>
  ) : null

  return (
    <div className="DiscGroupEditList">
      <MzTopbar title={{ prefix: '管理碟片', suffix: group?.title }} error={state.error?.message} />
      {group && (
        <>
          <Tabs type="card">
            <Tabs.TabPane tab="查询碟片" key="1">
              <SearchDisc theDiscs={group.discs} addDiscs={toAdds} onPushAdds={handlePushAdds} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="手动创建" key="2">
              <CreateDisc onPushAdds={handlePushAdds} />
            </Tabs.TabPane>
          </Tabs>
          <MyTable
            tag="toadds"
            rows={toAdds}
            cols={getColumns(getPushCommand())}
            title="待选列表"
          />
          <MyTable
            tag="editlist"
            rows={group.discs}
            cols={getColumns(getDropCommand())}
            title={group.title}
            defaultSort={compareRelease}
            extraCaption={extraCaption}
          />
        </>
      )}
    </div>
  )
}

function getColumns(extraColumn: MyColumn<IDisc>): MyColumn<IDisc>[] {
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
      compare: compareRelease,
    },
    {
      key: 'title',
      title: '碟片标题',
      format: (row) => <Link to={linkToDisc(row.id)}>{discTitle(row)}</Link>,
      compare: compareTitle,
    },
    extraColumn,
  ]
}
