import * as React from 'react'
import { Alert } from 'antd'
import { Column, Table } from '../../lib/table'
import './sakura.css'

import { Manager, Model } from '../../utils/manager'
import { BaseComponent, State } from '../BaseComponent'
import format from '../../utils/format'

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
  sakuraUpdateDate: number
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
      format: (t) => `${format(t.thisRank, '****')}位/${format(t.prevRank, '****')}位`
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

  render() {
    return (
      <div className="sakura-root">
        {this.state.errors && (
          <Alert message={this.state.errors} type="error"/>
        )}
        {this.state.models && this.state.models.map(sakura => (
          <div key={sakura.id}>
            <Table title={sakura.title} rows={sakura.discs} columns={this.columns}/>
          </div>
        ))}
      </div>
    )
  }
}
