import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Alert, Breadcrumb } from 'antd'
import { Link, RouteComponentProps } from 'react-router-dom'
import './topdisc.css'

import { TopDiscModel, TopDiscState } from './reducer'
import { Column, Table } from '../../lib/table'
import { formatNumber } from '../../utils/format'
import { Command } from '../../lib/command'
import { Timer } from '../../lib/timer'

export type OwnProps = RouteComponentProps<{}>

export interface Props extends TopDiscState, OwnProps {
  onShowAll: () => void
}

export function TopDisc(props: Props) {

  function getColumns(): Column<TopDiscModel>[] {
    return [
      {
        key: 'id',
        title: '#',
        format: (t, i) => i + 1
      },
      {
        key: 'rank',
        title: '日亚排名',
        format: (t) => formatRank(t)
      },
      {
        key: 'title',
        title: '碟片标题',
        format: (t) => <a href={`http://www.amazon.co.jp/dp/${t.asin}`} target="_blank">{t.title}</a>
      },
    ]
  }

  function formatRank(t: TopDiscModel) {
    const thisRank = t.rank ? formatNumber(t.rank, '***') : '---'
    const prevRank = t.prev ? formatNumber(t.prev, '***') : '---'
    return `${thisRank}位/${prevRank}位`
  }

  function trClass(t: TopDiscModel) {
    if (!props.isShowAll) {
      return ''
    }
    return t.isAnime ? 'is-anime' : 'no-anime'
  }

  function withModels(render: (models: TopDiscModel[]) => React.ReactNode) {
    if (props.models) {
      return render(props.models.filter(t => t.isAnime || props.isShowAll))
    }
    return null
  }

  function formatUpdateOn() {
    if (props.updateOn) {
      return (
        <Timer
          time={props.updateOn}
          timeout={1000}
          render={(state => `更新于${state.hour}时${state.minute}分${state.second}秒前`)}
        />
      )
    } else {
      return '从未更新'
    }
  }

  return (
    <div className="topdisc">
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
      {withModels(models => (
        <div className="topdisc-content">
          <Helmet>
            <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
          </Helmet>
          <div style={{paddingLeft: 10, paddingTop: 10}}>
            <Command onClick={props.onShowAll}>
              {props.isShowAll ? '当前显示所有碟片（点击只显示动画碟片）' : '当前只显示动画碟片（点击显示所有碟片）'}
            </Command>
          </div>
          <Table
            title={props.pageInfo.pageTitle}
            subtitle={formatUpdateOn()}
            rows={models}
            columns={getColumns()}
            trClass={trClass}
          />
        </div>
      ))}
    </div>
  )
}
