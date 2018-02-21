import * as React from 'react'
import { Alert } from 'antd'
import { Column, Table } from '../../lib/table'
import { Timer } from '../../lib/timer'
import './sakura.css'

import { Manager, Model } from '../../utils/manager'
import { BaseComponent, State } from '../BaseComponent'
import { formatNumber } from '../../utils/format'
import { compareFactory } from '../../utils/compare'

interface DiscModel extends Model {
  thisRank: number
  prevRank: number
  totalPt: number
  title: string
}

interface SakuraModel extends Model {
  key: string
  title: string
  enabled: boolean
  modifyTime: number
  discs: DiscModel[]
}

interface SakuraState extends State<SakuraModel> {
}

export class Sakura extends BaseComponent<SakuraModel, SakuraState> {

  state: SakuraState = {}

  manager = new Manager<SakuraModel>('/api/sakuras')

  componentWillMount() {
    this.listModelSupport(() => {
      return this.manager.findAll('discColumns=id,thisRank,prevRank,totalPt,title')
    })
  }

  columns: Column<DiscModel>[] = [
    {
      key: 'rank',
      title: '日亚排名',
      format: (t) => this.formatRank(t)
    },
    {
      key: 'totalPt',
      title: '累积PT',
      format: (t) => this.formatTotalPt(t)
    },
    {
      key: 'title',
      title: '碟片标题',
      format: (t) => t.title
    },
  ]

  formatRank = (t: DiscModel) => {
    const thisRank = t.thisRank ? formatNumber(t.thisRank, '****') : '----'
    const prevRank = t.prevRank ? formatNumber(t.prevRank, '****') : '----'
    return `${thisRank}位/${prevRank}位`
  }

  formatTotalPt = (t: DiscModel) => {
    const totalPt = t.totalPt || '----'
    return `${totalPt} pt`
  }

  compareRank = compareFactory({
    apply: (disc: DiscModel) => disc.thisRank,
    check: (rank: number) => rank === undefined,
    compare: (rankA: number, rankB: number) => rankA - rankB
  })

  render() {
    if (this.state.models) {
      this.state.models.forEach(sakura => {
        sakura.discs.sort(this.compareRank)
      })
    }
    return (
      <div className="sakura-root">
        {this.state.errors && (
          <Alert message={this.state.errors} type="error"/>
        )}
        {this.state.models && this.state.models.map(sakura => (
          <div key={sakura.id}>
            <Table
              title={sakura.title}
              subtitle={this.timeout(sakura.modifyTime)}
              rows={sakura.discs}
              columns={this.columns}
            />
          </div>
        ))}
      </div>
    )
  }

  timeout = (time: number) => {
    return (
      <Timer
        time={time}
        timeout={1000}
        render={(state => `${state.hour}时${state.minute}分${state.second}秒前`)}
      />
    )
  }
}
