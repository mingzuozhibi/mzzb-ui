import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'
import './public.css'

import { compareFactory } from '../../utils/compare'

import { DiscModel, PublicState, SakuraModel } from './reducer'
import { PublicList } from './public-list'
import { PublicView } from './public-view'
import produce from 'immer'

const compareRank = compareFactory({
  apply: (disc: DiscModel) => disc.thisRank,
  check: (rank: number) => rank === undefined,
  compare: (rankA: number, rankB: number) => rankA - rankB
})

export type OwnProps = RouteComponentProps<{}>

export interface PublicProps extends PublicState, OwnProps {
}

export function Public(props: PublicProps) {

  function withModels(render: (models: SakuraModel[]) => React.ReactNode) {
    if (props.models) {
      const newModels = produce(props.models, draft => {
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

  return (
    <div className="public">
      {props.message && (
        <Alert message={props.message} type="error"/>
      )}
      <Switch>
        <Route
          path={`${props.match.url}`}
          exact={true}
          render={() => withModels(models => (
            <div className="public-list">
              <Helmet>
                <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  {props.pageInfo.pageTitle}
                </Breadcrumb.Item>
              </Breadcrumb>
              <PublicList models={models} pageInfo={props.pageInfo}/>
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/:key`}
          exact={true}
          render={({match}) => withDetail(match.params.key, detail => (
            <div className="public-view">
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
              <PublicView detail={detail}/>
            </div>
          ))}
        />
      </Switch>
    </div>
  )
}
