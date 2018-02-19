import * as React from 'react'
import { BaseComponent } from '../BaseComponent'
import { Column, Table } from '../../lib/table'
import './sakura.css'

import { Manager, Model } from '../../utils/manager'
import { AppState } from '../../App'
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

interface State {
  sakuras?: SakuraModel[]
  message?: string
}

export class Sakura extends BaseComponent<State> {

  state: State = {}

  manager = new Manager<SakuraModel>('/api/sakuras')

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

  listSakura = async () => {
    this.context.update((draft: AppState) => {
      draft.reload!.pending = true
    })

    const query = 'discColumns=id,thisRank,prevRank,totalPt,title'
    const result = await this.manager.findAll(query)

    this.update(draft => {
      if (result.success) {
        draft.sakuras = result.data
        draft.message = undefined
      } else {
        draft.message = result.message
      }
    })

    this.context.update((draft: AppState) => {
      draft.reload!.pending = false
    })
  }

  componentWillMount() {
    this.listModels = this.listSakura
  }

  render() {
    return (
      <div className="sakura-root">
        {this.state.sakuras && this.state.sakuras.map(sakura => (
          <div key={sakura.id}>
            <Table title={sakura.title} rows={sakura.discs} columns={this.columns}/>
          </div>
        ))}
      </div>
    )
  }
}
