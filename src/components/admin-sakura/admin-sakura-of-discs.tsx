import * as React from 'react'
import { DiscModel, SakuraOfDiscsModel } from './reducer'
import { formatNumber, formatTimeout } from '../../utils/format'
import { Column, Table } from '../../lib/table'

interface AdminSakuraOfDiscsProps {
  detail: SakuraOfDiscsModel
}

export function AdminSakuraOfDiscs(props: AdminSakuraOfDiscsProps) {

  function getColumns(): Column<DiscModel>[] {
    return [
      {
        key: 'id',
        title: 'ID',
        format: (t) => t.id
      },
      {
        key: 'asin',
        title: 'ASIN',
        format: (t) => t.asin
      },
      {
        key: 'rank',
        title: '排名',
        format: (t) => formatRank(t)
      },
      {
        key: 'surplusDays',
        title: '天数',
        format: (t) => `${t.surplusDays}天`
      },
      {
        key: 'title',
        title: '碟片标题',
        format: (t) => t.title
      },
    ]
  }

  function formatRank(t: DiscModel) {
    const thisRank = t.thisRank ? formatNumber(t.thisRank, '****') : '----'
    return `${thisRank}位`
  }

  return (
    <div className="admin-sakura-of-discs-content">
      <Table
        key={props.detail.id}
        title={props.detail.title}
        subtitle={formatTimeout(props.detail.modifyTime)}
        rows={props.detail.discs}
        columns={getColumns()}
      />
    </div>
  )
}
