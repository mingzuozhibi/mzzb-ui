import { useAppSelector } from '#A/hooks'
import { MzHeader } from '#C/header/MzHeader'
import { MzColumn, MzTable } from '#C/table/MzTable'
import { useLocal } from '#H/useLocal'
import { useOnceRequest } from '#H/useOnce'
import { thenCompare } from '#U/compare'
import { isJustUpdate } from '#U/date/check'
import { formatTimeout } from '#U/date/timeout'
import { fetchResult } from '#U/fetch/fetchResult'
import { UrlBuilder } from '#U/fetch/urlBuilder'
import { EditOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import './DiscGroups.scss'

import { apiToGroups, linkToGroups } from '#A/links'
import { viewTypes } from '#A/metas'
import { IGroupCount } from '#T/disc'
import { Button } from 'antd'
import { useState } from 'react'

const adminCols = buildColumns()
const guestCols = adminCols.filter((col) => !['edit', 'item'].includes(col.key))

const defaultSort = compareDiscGroups()

export default function DiscGroups() {
  const navigate = useNavigate()
  const hasBasic = useAppSelector((state) => state.session.hasBasic)

  const [isAdmin, setIsAdmin] = useLocal('groups-isadmin', false)
  const [hasSave, setHasSave] = useLocal('groups-hassave', false)
  const [hasMore, setHasMore] = useState(false)

  const apiUrl = new UrlBuilder(apiToGroups())
    .append('hasPrivate', hasBasic && isAdmin)
    .append('hasDisable', hasSave || hasMore)
    .toString()

  const { data: groups, ...state } = useOnceRequest(
    () => fetchResult<IGroupCount[]>(apiUrl).then((result) => result.data),
    { refreshDeps: [apiUrl] }
  )

  const lastCols = hasBasic && isAdmin ? adminCols : guestCols

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
            label: isAdmin ? '浏览模式' : '管理模式',
            onClick: () => setIsAdmin(!isAdmin),
            disabled: !hasBasic,
          },
          {
            key: 'K3',
            label: hasSave ? '隐藏存档' : '显示存档',
            onClick: () => setHasSave(!hasSave),
          },
        ]}
      />
      {groups && (
        <MzTable
          tag="groups"
          rows={groups}
          cols={lastCols}
          trClass={trClass}
          defaultSort={defaultSort}
        />
      )}
      {!hasMore && (
        <Button type="link" onClick={() => setHasMore(true)} style={{ marginTop: 8 }}>
          显示停止更新的列表
        </Button>
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
      format: (row) => {
        if (!row.enabled || !row.modifyTime) return '停止更新'
        return formatTimeout(row.modifyTime)
      },
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

function compareDiscGroups() {
  const sorts = viewTypes.map((e) => e.value)
  return thenCompare<IGroupCount>(
    (a, b) => sorts.indexOf(a.viewType) - sorts.indexOf(b.viewType),
    (a, b) => b.key.localeCompare(a.key)
  )
}
