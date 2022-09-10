import { MzColumn, MzTable } from '#C/table/MzTable'
import { MzTopbar } from '#C/topbar/MzTopbar'
import { useAjax } from '#H/useAjax'
import { useOnceRequest } from '#H/useOnce'
import { fetchResult } from '#U/fetch/fetchResult'
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Tabs } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './DiscGroupEditList.scss'

import { linkToDisc, linkToGroup, linkToGroupViewList } from '#A/links'
import { CreateDisc } from '#P/@to-add-list/create-disc'
import { SearchDisc } from '#P/@to-add-list/search-disc'
import { IDisc, IGroupDiscs } from '#T/disc'
import { compareRelease, compareTitle, discTitle } from '#T/disc-utils'
import { useAppDispatch, useAppSelector } from '#A/hooks'
import { cleanToAdds, dropToAdds, pushToAdds } from '#F/local'

export default function DiscGroupEditList() {
  const params = useParams<{ key: string }>()
  const groupKey = params.key as string

  const url = `/api/discGroups/key/${groupKey}/discs`
  const { data: group, ...state } = useOnceRequest(() =>
    fetchResult<IGroupDiscs>(url).then((result) => result.data)
  )

  const [, doPush] = useAjax<IDisc>('post')
  const [, doDrop] = useAjax<IDisc>('delete')

  const toAdds = useAppSelector((state) => state.local.toAdds)
  const dispatch = useAppDispatch()

  function doPushAdds(disc: IDisc) {
    dispatch(pushToAdds(disc))
  }

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

  function getPushCommand() {
    return {
      key: 'command',
      title: '添加',
      format: (row: IDisc) => <FileAddOutlined onClick={() => doPushDiscs(group!.id, row.id)} />,
    }
  }

  function getDropCommand() {
    return {
      key: 'command',
      title: '移除',
      format: (row: IDisc) => <DeleteOutlined onClick={() => doDropDiscs(group!.id, row.id)} />,
    }
  }

  const navigate = useNavigate()

  return (
    <div className="DiscGroupEditList" style={{ maxWidth: 650 }}>
      <MzTopbar title={{ prefix: '管理碟片', suffix: group?.title }} error={state.error?.message} />
      {group && (
        <>
          <Tabs type="card">
            <Tabs.TabPane tab="查询碟片" key="1">
              <SearchDisc theDiscs={group.discs} addDiscs={toAdds} onPushAdds={doPushAdds} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="手动创建" key="2">
              <CreateDisc onPushAdds={doPushAdds} />
            </Tabs.TabPane>
          </Tabs>
          <MzTable
            tag="toadds"
            rows={toAdds}
            cols={buildColumns(getPushCommand())}
            title="待选列表"
            extraCaption={
              <Popconfirm
                title="确定要清空待选列表吗？"
                okText="Yes"
                cancelText="No"
                onConfirm={() => dispatch(cleanToAdds())}
              >
                <Button>清空</Button>
              </Popconfirm>
            }
          />
          <MzTable
            tag="editlist"
            rows={group.discs}
            cols={buildColumns(getDropCommand())}
            title={group.title}
            defaultSort={compareRelease}
            extraCaption={
              <Space>
                <Button onClick={() => navigate(linkToGroup(group.key))}>编辑列表</Button>
                <Button onClick={() => navigate(linkToGroupViewList(group.key))}>浏览碟片</Button>
              </Space>
            }
          />
        </>
      )}
    </div>
  )
}

function buildColumns(extraColumn: MzColumn<IDisc>): MzColumn<IDisc>[] {
  return [
    {
      key: 'asin',
      title: 'ASIN',
      format: (row) => row.asin,
      compare: (a, b) => a.asin.localeCompare(b.asin),
    },
    {
      key: 'release',
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
