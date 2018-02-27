import * as React from 'react'
import { Column, Table } from '../../lib/table'
import { Timer } from '../../lib/timer'
import './sakura.css'

import { formatNumber } from '../../utils/format'
import { DiscModel, SakuraModel } from './reducer'

interface SakuraListProps {
  models: SakuraModel[]
}

export function SakuraList(props: SakuraListProps) {

  function getColumns(): Column<DiscModel>[] {
    return [
      {
        key: 'rank',
        title: '日亚排名',
        format: (t) => formatRank(t)
      },
      {
        key: 'totalPt',
        title: '累积PT',
        format: (t) => formatTotalPt(t)
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
    const prevRank = t.prevRank ? formatNumber(t.prevRank, '****') : '----'
    return `${thisRank}位/${prevRank}位`
  }

  function formatTotalPt(t: DiscModel) {
    const totalPt = t.totalPt || '----'
    return `${totalPt} pt`
  }

  function formatModifyTime(sakura: SakuraModel) {
    if (sakura.modifyTime) {
      return (
        <Timer
          time={sakura.modifyTime}
          timeout={1000}
          render={(state => `${state.hour}时${state.minute}分${state.second}秒前`)}
        />
      )
    } else {
      return '从未更新'
    }
  }

  return (
    <div className="sakura-list-content">
      {props.models.map(sakura => (
        <Table
          key={sakura.id}
          title={sakura.title}
          subtitle={formatModifyTime(sakura)}
          rows={sakura.discs}
          columns={getColumns()}
        />
      ))}
    </div>
  )
}
