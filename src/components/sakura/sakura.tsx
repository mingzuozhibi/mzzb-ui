import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'
import './sakura.css'

import { sakuraDiscsMessge, sakuraListMessge } from '../../common/site-messages'
import { compareFactory } from '../../utils/compare'
import { viewTypes } from '../admin-sakura/reducer'
import { Session } from '../../App/reducer'
import produce from 'immer'

import { DiscModel, SakuraModel, SakuraOfDiscsModel, SakuraState } from './reducer'
import { SakuraList } from './sakura-list'
import { SakuraDiscs } from './sakura-with-discs'

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
  session: Session
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

  const hasBasicRole = props.session.userRoles.some(role => role === 'ROLE_BASIC')

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
          render={({match}) => withModels(models => (
            <div className="sakura-list">
              <Helmet>
                <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
              </Helmet>
              <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                  {props.pageInfo.pageTitle}
                </Breadcrumb.Item>
                {hasBasicRole && (
                  <Breadcrumb.Item>
                    <Link to={`/admin${match.url}`}>跳转到后台模式</Link>
                  </Breadcrumb.Item>
                )}
              </Breadcrumb>
              {sakuraListMessge && (
                <div style={{paddingBottom: 10}}>
                  <Alert message={sakuraListMessge}/>
                </div>
              )}
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
                {hasBasicRole && (
                  <Breadcrumb.Item>
                    <Link to={`/admin${match.url}`}>跳转到后台模式</Link>
                  </Breadcrumb.Item>
                )}
                <Breadcrumb.Item>
                  {detail.title}
                </Breadcrumb.Item>
              </Breadcrumb>
              {sakuraDiscsMessge && (
                <Alert type="info" message={sakuraDiscsMessge}/>
              )}
              <SakuraDiscs
                detail={detail}
                toViewDisc={(t: DiscModel) => {
                  history.push(`/disc/${t.id}`, {
                    url: match.url, title: detail.title
                  })
                }}
                toViewRank={(t: DiscModel) => {
                  history.push(`/disc/${t.id}/records`, {
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
