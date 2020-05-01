import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons'
import { Button, Input, Modal } from 'antd'
import produce from 'immer'

import { useData } from '../../../hooks/useData'
import { useAjax } from '../../../hooks/useAjax'
import { formatTimeout } from '../../../funcs/format'
import { composeCompares } from '../../../funcs/compare'
import { CustomHeader } from '../../../comps/CustomHeader'
import { Column, Table } from '../../../comps/@table/Table'

import { compareSurp, compareTitle, discTitle } from '../../@funcs'
import { InjectToAdds, injectToAdds } from '../../@inject'
import { Disc, DiscGroup, RouteProps } from '../../@types'
import './DiscGroupItems.scss'

interface Data extends DiscGroup {
  discs: Disc[]
}

const columns = 'id,asin,title,titlePc,surplusDays'

export default injectToAdds(DiscGroupItems)

function DiscGroupItems(props: InjectToAdds & RouteProps<{ key: string }>) {

  const {toAdds, pushToAdds, dropToAdds, fetchCount, setFetchCount, match} = props
  const findDiscsUrl = `/api/discGroups/key/${match.params.key}/discs?discColumns=${columns}`
  const [{error, data}, handler, {modify}] = useData<Data>(findDiscsUrl)
  const [discSearching, doSearchDisc] = useAjax<Disc>('get')
  const [countSearching, doSearchCount] = useAjax<number>('get')
  const [, doPush] = useAjax<Disc>('post')
  const [, doDrop] = useAjax<Disc>('delete')
  const asinRef = useRef<string>()

  function searchDisc() {
    const asin = asinRef.current

    if (!asin) {
      Modal.warning({title: '请检查输入项', content: `碟片ASIN必须输入`})
      return
    }

    if (toAdds.some(t => t.asin === asin)) {
      Modal.warning({title: '请检查输入项', content: `该碟片已存在于待选列表`})
      return
    }

    if (data!.discs.some(t => t.asin === asin)) {
      Modal.warning({title: '请检查输入项', content: `该碟片已存在于当前列表`})
      return
    }

    doSearchDisc(`/api/admin/searchDisc/${asin}`, '查询碟片', {
      onSuccess: pushToAdds
    })
  }

  function pushDisc(discGroupId: number, discId: number) {
    doPush(`/api/discGroups/${discGroupId}/discs/${discId}`, '添加碟片到列表', {
      onSuccess(disc: Disc) {
        dropToAdds(disc)
        modify(produce(data!, (draft: Data) => {
          draft.discs = [disc, ...data!.discs]
        }))
      }
    })
  }

  function dropDisc(discGroupId: number, discId: number) {
    doDrop(`/api/discGroups/${discGroupId}/discs/${discId}`, '从列表移除碟片', {
      onSuccess(disc: Disc) {
        pushToAdds(disc)
        modify(produce(data!, (draft: Data) => {
          draft.discs = data!.discs.filter(e => e.id !== disc.id)
        }))
      }
    })
  }

  function fetchActiveCount() {
    doSearchCount('/api/admin/fetchCount', '查询抓取中的碟片数量', {onSuccess: setFetchCount})
  }

  function getPushCommand() {
    return {
      key: 'command',
      title: '添加',
      format: (t: Disc) => <FileAddOutlined onClick={() => pushDisc(data!.id, t.id)}/>
    }
  }

  function getDropCommand() {
    return {
      key: 'command',
      title: '移除',
      format: (t: Disc) => <DeleteOutlined onClick={() => dropDisc(data!.id, t.id)}/>
    }
  }

  const title = data ? `管理碟片：${data.title}` : '载入中'

  return (
    <div className="DiscGroupItems">
      <CustomHeader header="管理碟片" title={title} error={error} handler={handler}/>
      {data && (
        <>
          <div className="input-wrapper">
            <Input
              addonBefore="ASIN"
              onChange={e => asinRef.current = e.target.value}
              placeholder="请输入ASIN"
            />
          </div>
          <div className="input-wrapper button-group">
            <Button loading={discSearching} onClick={searchDisc}>查找碟片</Button>
            <Button loading={countSearching} onClick={fetchActiveCount}>
              {fetchCount !== undefined ? `抓取中碟片数量(${fetchCount})` : '查询抓取中的碟片数量'}
            </Button>
          </div>
          <Table
            rows={toAdds}
            cols={getColumns(getPushCommand())}
            title="待选列表"
          />
          <Table
            rows={data.discs}
            cols={getColumns(getDropCommand())}
            title={data.title}
            extraCaption={`更新于${formatTimeout(data.lastUpdate)}前`}
            defaultSort={composeCompares([compareSurp, compareTitle])}
          />
        </>
      )}
    </div>
  )
}

function getColumns(extraColumn: Column<Disc>): Column<Disc>[] {
  return [
    {
      key: 'asin',
      title: 'ASIN',
      format: (t) => t.asin,
      compare: (a, b) => a.asin.localeCompare(b.asin)
    },
    {
      key: 'surp',
      title: '天数',
      format: (t) => `${t.surplusDays}天`,
      compare: composeCompares([compareSurp, compareTitle]),
    },
    {
      key: 'title',
      title: '碟片标题',
      format: formatTitle,
      compare: compareTitle,
    },
    extraColumn
  ]
}

function formatTitle(disc: Disc) {
  return <Link to={`/discs/${disc.id}`}>{discTitle(disc)}</Link>
}
