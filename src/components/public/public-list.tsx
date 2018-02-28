import * as React from 'react'
import { Link } from 'react-router-dom'
import './public.css'

import { Timer } from '../../lib/timer'
import { Column, Table } from '../../lib/table'
import { SakuraModel } from './reducer'
import { PageInfo } from '../../common/route-infos'

interface PublicListProps {
  models: SakuraModel[]
  pageInfo: PageInfo
}

export function PublicList(props: PublicListProps) {

  function getSakuraColumns(): Column<SakuraModel>[] {
    return [
      {
        key: 'id',
        title: 'ID',
        format: (t) => t.id
      },
      {
        key: 'key',
        title: '索引',
        format: (t) => t.key
      },
      {
        key: 'title',
        title: `${props.pageInfo.modelName}标题 (点击进入${props.pageInfo.modelName})`,
        format: (t) => <Link to={`/public/${t.key}`}>{t.title}</Link>
      },
      {
        key: 'modifyTime',
        title: '上次更新',
        format: (t) => formatModifyTime(t)
      },
    ]
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

  return (
    <div className="public-list-content">
      <Table rows={props.models} columns={getSakuraColumns()}/>
    </div>
  )
}
