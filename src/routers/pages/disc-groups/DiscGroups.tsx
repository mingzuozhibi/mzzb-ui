import { useAppSelector } from '#CA/hooks'
import { MzHeader } from '#CC/header/MzHeader'
import { MzColumn, MzTable } from '#CC/table/MzTable'
import { useLocal, useSession } from '#CH/useLocal'
import { useData } from '#CH/useOnce'
import { EditOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Radio, Space } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import './DiscGroups.scss'

import { IGroupCount } from '#DT/disc'
import { compareGroups, formatUpdate } from '#DU/group-utils'
import { isJustUpdate } from '#RU/check'
import { apiToGroups, linkToGroups } from '#RU/links'

const adminCols = buildColumns()
const guestCols = adminCols.filter((col) => !['edit', 'item'].includes(col.key))

export default function DiscGroups() {
  const navigate = useNavigate()
  const hasBasic = useAppSelector((state) => state.session.hasBasic)

  const [filter, setFilter] = useLocal('groups-filter', 'top')
  const [isMore, setIsMore] = useSession('groups-ismore', false)

  const getPub = filter === 'top' && isMore === true
  const apiUrl = apiToGroups(`?filter=${getPub ? 'pub' : filter}`)

  const { data: groups, ...state } = useData<IGroupCount[]>(apiUrl, {
    refreshDeps: [apiUrl],
  })

  const lastCols = hasBasic && filter === 'all' ? adminCols : guestCols

  return (
    <div className="DiscGroups" style={{ maxWidth: 650 }}>
      <MzHeader
        title="推荐列表"
        state={state}
        items={[
          {
            key: 'K1',
            label: '添加列表',
            onClick: () => navigate(linkToGroups(`/add`)),
            disabled: !hasBasic,
          },
          {
            key: 'K2',
            label: '设置过滤',
            children: [
              {
                key: 'S1',
                label: <Radio checked={filter === 'top' && isMore !== true}>显示推荐列表</Radio>,
                onClick: () => {
                  setFilter('top')
                  setIsMore(false)
                },
              },
              {
                key: 'S2',
                label: <Radio checked={filter === 'pub' || isMore === true}>显示公开列表</Radio>,
                onClick: () => setFilter('pub'),
              },
              {
                key: 'S3',
                label: <Radio checked={filter === 'all'}>管理所有列表</Radio>,
                onClick: () => {
                  setFilter('all')
                  setIsMore(false)
                },
                disabled: !hasBasic,
              },
            ],
          },
        ]}
      />
      {groups && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <MzTable
            tag="groups"
            rows={groups}
            cols={lastCols}
            trClass={trClass}
            defaultSort={compareGroups}
          />
          {filter === 'top' && isMore === false && (
            <Button type="link" onClick={() => setIsMore(true)}>
              点击加载更多列表
            </Button>
          )}
        </Space>
      )}
    </div>
  )
}

function trClass(t: IGroupCount) {
  return { warning: t.viewType === 'PrivateList' }
}

function buildColumns(): MzColumn<IGroupCount>[] {
  return [
    {
      key: 'idx',
      title: '#',
      format: (row, idx) => idx + 1,
    },
    {
      key: 'title',
      title: '列表标题',
      format: (row) => {
        let color = isJustUpdate(row.modifyTime, 1) ? 'red' : '#C67532'
        return (
          <span>
            <Link to={linkToGroups(`/${row.key}/discs`)}>{row.title}</Link>
            <span style={{ color, marginLeft: 8 }}>({row.discCount})</span>
          </span>
        )
      },
    },
    {
      key: 'update',
      title: '最后更新',
      format: formatUpdate,
    },
    {
      key: 'edit',
      title: '编辑列表',
      format: (row) => {
        return (
          <Link to={linkToGroups(`/${row.key}`)}>
            <EditOutlined />
          </Link>
        )
      },
    },
    {
      key: 'item',
      title: '增减碟片',
      format: (row) => {
        return (
          <Link to={linkToGroups(`/${row.key}/discs/edit`)}>
            <UnorderedListOutlined />
          </Link>
        )
      },
    },
  ]
}
