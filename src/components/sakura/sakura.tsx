import * as React from 'react'
import { Alert } from 'antd'
import { Column, Table } from '../../lib/table'
import { Timer } from '../../lib/timer'
import './sakura.css'

import { Manager, Model } from '../../utils/manager'
import { BaseComponent, State } from '../BaseComponent'
import { formatNumber } from '../../utils/format'

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
      title: 'Rank',
      format: (t) => this.formatRank(t)
    },
    {
      key: 'totalPt',
      title: 'TotalPt',
      format: (t) => `${t.totalPt} pt`
    },
    {
      key: 'title',
      title: 'Title',
      format: (t) => t.title
    },
  ]

  formatRank = (t: DiscModel) => {
    return `${formatNumber(t.thisRank, '****')}位/${formatNumber(t.prevRank, '****')}位`
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

  render() {
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
}
