import * as React from 'react'
import { Link } from 'react-router-dom'
import { Alert, Breadcrumb } from 'antd'
import { Column, Table } from '../../lib/table'
import { Timer } from '../../lib/timer'
import { Helmet } from 'react-helmet'
import './sakura.css'

import { formatNumber } from '../../utils/format'
import { compareFactory } from '../../utils/compare'
import { DiscModel, SakuraModel, SakuraState } from './reducer'
import { Route, RouteComponentProps, Switch } from 'react-router'
import produce from 'immer'

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
      const newModels = produce(props.models, draft => {
        draft.forEach(sakura => {
          sakura.discs.sort(compareRank)
        })
        draft.sort((a, b) => b.key.localeCompare(a.key))
      })
      return render(newModels)
    }
    return null
  }

  function withDetail(key: string, render: (detail: SakuraModel) => React.ReactNode) {
    if (props.detail && props.detail.key === key) {
      const newDetail = produce(props.detail, draft => {
        draft.discs.sort(compareRank)
      })
      return render(newDetail)
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

  // console.info(`sakura render ${props.models !== undefined} ${new Date()}`)

  return (
    <div className="sakura-root">
      {props.message && (
        <Alert message={props.message} type="error"/>
      )}
      <Switch>
        <Route
          path={`${props.match.url}`}
          exact={true}
          render={() => withModels(models => (
            <div>
              <Helmet>
                <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  {props.pageInfo.pageTitle}
                </Breadcrumb.Item>
                {models.map(sakura => (
                  <Breadcrumb.Item key={sakura.id}>
                    <Link to={`${props.match.url}/${sakura.key}`}>
                      {sakura.title}
                    </Link>
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
              {models.map(sakura => (
                <Table
                  key={sakura.id}
                  title={sakura.title}
                  subtitle={formatModifyTime(sakura)}
                  rows={sakura.discs}
                  columns={getColumns()}
                />
              ))}
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/:key`}
          exact={true}
          render={({match}) => withDetail(match.params.key, detail => (
            <div>
              <Helmet>
                <title>{detail.title} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  <Link to={props.match.url}>{props.pageInfo.pageTitle}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {detail.title}
                </Breadcrumb.Item>
              </Breadcrumb>
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
