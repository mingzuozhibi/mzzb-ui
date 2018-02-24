import * as React from 'react'
import { Alert } from 'antd'
import { Column, Table } from '../../lib/table'
import { Timer } from '../../lib/timer'
import './sakura.css'

import { formatNumber } from '../../utils/format'
import { compareFactory } from '../../utils/compare'
import { DiscModel, SakuraModel, SakuraState } from './reducer'
import { Route, RouteComponentProps, Switch } from 'react-router'

const compareRank = compareFactory({
  apply: (disc: DiscModel) => disc.thisRank,
  check: (rank: number) => rank === undefined,
  compare: (rankA: number, rankB: number) => rankA - rankB
})

export type OwnProps = RouteComponentProps<{}>

export interface SakuraProps extends SakuraState, OwnProps {
}

export function Sakura(props: SakuraProps) {

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

  function withModels(render: (models: SakuraModel[]) => React.ReactNode) {
    if (props.models) {
      props.models.forEach(sakura => {
        sakura.discs.sort(compareRank)
      })
      props.models.sort((a, b) => b.key.localeCompare(a.key))
      return render(props.models)
    }
    return null
  }

  function withDetail(id: string, render: (detail: SakuraModel) => React.ReactNode) {
    if (props.models) {
      const detail = props.models.find(t => {
        return t.id === parseInt(id, 10)
      })
      if (detail) {
        detail.discs.sort(compareRank)
        return render(detail)
      } else {
        return <Alert message={`未找到ID=${id}的Sakura`} type="error"/>
      }
    }
    return null
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

  // console.info(`sakura render ${props.models !== undefined}`)

  return (
    <div className="sakura-root">
      {props.message && (
        <Alert message={props.message} type="error"/>
      )}
      <Switch>
        <Route
          path={`${props.match.url}`}
          exact={true}
          render={() => withModels(models => models.map(sakura => (
            <div key={sakura.id}>
              <Table
                title={sakura.title}
                subtitle={formatModifyTime(sakura)}
                rows={sakura.discs}
                columns={getColumns()}
              />
            </div>
          )))}
        />
        <Route
          path={`${props.match.url}/:id`}
          exact={true}
          render={({match}) => withDetail(match.params.id, detail => (
            <div key={detail.id}>
              <Table
                title={detail.title}
                subtitle={formatModifyTime(detail)}
                rows={detail.discs}
                columns={getColumns()}
              />
            </div>
          ))}
        />
      </Switch>
    </div>
  )
}
