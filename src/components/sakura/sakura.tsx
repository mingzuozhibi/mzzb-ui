import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'
import './sakura.css'

import { compareFactory } from '../../utils/compare'
import { viewTypes } from '../admin-sakura/reducer'

import { DiscModel, SakuraModel, SakuraOfDiscsModel, SakuraState } from './reducer'
import { SakuraList } from './sakura-list'
import { SakuraDiscs } from './sakura-with-discs'
import produce from 'immer'

const compareList = (a: SakuraModel, b: SakuraModel) => {
  const indexA = viewTypes.findIndex(v => v.value === a.viewType)
  const indexB = viewTypes.findIndex(v => v.value === b.viewType)
  if (indexA !== indexB) {
    return indexA - indexB
  }
  if (a.viewType !== 'PrivateList') {
    return b.key.localeCompare(a.key)
  } else {
    return a.key.localeCompare(b.key)
  }
}

const compareDisc = compareFactory({
  apply: (disc: DiscModel) => disc.thisRank,
  check: (rank: number) => rank === undefined,
  compare: (rankA: number, rankB: number) => rankA - rankB
})

export type OwnProps = RouteComponentProps<{}>

export interface Props extends SakuraState, OwnProps {
}

export function Sakura(props: Props) {

  function withModels(render: (models: SakuraModel[]) => React.ReactNode) {
    if (props.models) {
      const newModels = produce(props.models, draftState => {
        draftState.sort(compareList)
      })
      return render(newModels)
    }
    return null
  }

  function withDetailOfDiscs(key: string, render: (detail: SakuraOfDiscsModel) => React.ReactNode) {
    if (props.detailOfDiscs && props.detailOfDiscs.key === key) {
      const newDetail = produce(props.detailOfDiscs, draftState => {
        draftState.discs.sort(compareDisc)
      })
      return render(newDetail)
    }
    return null
  }

  // console.info(`sakura render ${props.models !== undefined} ${new Date()}`)

  return (
    <div className="sakura">
      {props.message && (
        <div>
          <Breadcrumb style={{padding: 10}}>
            <Breadcrumb.Item>
              <Link to={props.match.url}>{props.pageInfo.pageTitle}</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Alert message={props.message} type="error"/>
        </div>
      )}
      <Switch>
        <Route
          path={`${props.match.url}`}
          exact={true}
          render={() => withModels(models => (
            <div className="sakura-list">
              <Helmet>
                <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  {props.pageInfo.pageTitle}
                </Breadcrumb.Item>
              </Breadcrumb>
              <SakuraList
                models={models}
                viewDiscsTo={t => `${props.match.url}/${t.key}/discs`}
              />
            </div>
          ))}
        />
        <Route
          path={`${props.match.url}/:key/discs`}
          exact={true}
          render={({match, history}) => withDetailOfDiscs(match.params.key, detail => (
            <div className="sakura-discs">
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
              <SakuraDiscs
                detail={detail}
                toViewDisc={(t: DiscModel) => {
                  history.push(`/disc/${t.id}`, {
                    url: match.url, title: detail.title
                  })
                }}
              />
            </div>
          ))}
        />
      </Switch>
    </div>
  )
}
