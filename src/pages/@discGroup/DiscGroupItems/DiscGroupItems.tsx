import React, { useRef } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Alert, Button, Input, Modal, PageHeader } from 'antd'
import { Delete as DeleteIcon, FileAdd as FileAddIcon } from '@ant-design/icons'

import { useData } from '../../../hooks/useData'
import { useAjax } from '../../../hooks/useAjax'
import { Column, Table } from '../../../comps/@table/Table'
import { formatTimeout } from '../../../funcs/format'
import { composeCompares } from '../../../funcs/compare'

import { compareSurp, compareTitle, Disc, titleString } from '../../@disc/disc'
import { DiscGroup } from '../discGroup'
import './DiscGroupItems.scss'
import produce from 'immer'

interface Data extends DiscGroup {
  discs: Disc[]
}

interface Props {
  toAdds: Disc[]
  pushToAdds: (disc: Disc) => void
  dropToAdds: (disc: Disc) => void
  fetchCount?: number
  setFetchCount: (fetchCount: number) => void
}

export function DiscGroupItems(props: Props & RouteComponentProps<{ key: string }>) {

  const {toAdds, pushToAdds, dropToAdds, fetchCount, setFetchCount, match} = props
  const [{error, data}, , {modify}] = useData<Data>(`/api/sakuras/key/${match.params.key}/discs`)
  const [discSearching, doSearchDisc] = useAjax<Disc[]>('get')
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

    doSearchDisc(`/api/discs/search/${asin}`, '查询碟片', {
      onSuccess(discs) {
        discs.forEach(pushToAdds)
      }
    })
  }

  function pushDisc(discGroupId: number, discId: number) {
    doPush(`/api/sakuras/${discGroupId}/discs/${discId}`, '添加碟片到列表', {
      onSuccess(disc: Disc) {
        dropToAdds(disc)
        modify(produce(data!, (draft: Data) => {
          draft.discs = [disc, ...data!.discs]
        }))
      }
    })
  }

  function dropDisc(discGroupId: number, discId: number) {
    doDrop(`/api/sakuras/${discGroupId}/discs/${discId}`, '从列表移除碟片', {
      onSuccess(disc: Disc) {
        pushToAdds(disc)
        modify(produce(data!, (draft: Data) => {
          draft.discs = data!.discs.filter(e => e.id !== disc.id)
        }))
      }
    })
  }

  function fetchActiveCount() {
    doSearchCount('/api/discs/activeCount', '查询抓取中的碟片数量', {onSuccess: setFetchCount})
  }

  function getPushCommand() {
    return {
      key: 'command',
      title: '添加',
      format: (t: Disc) => <FileAddIcon onClick={() => pushDisc(data!.id, t.id)}/>
    }
  }

  function getDropCommand() {
    return {
      key: 'command',
      title: '移除',
      format: (t: Disc) => <DeleteIcon onClick={() => dropDisc(data!.id, t.id)}/>
    }
  }

  return (
    <div className="DiscGroupItems">
      <PageHeader title="增减碟片" onBack={() => window.history.back()}/>
      {error && (
        <Alert message={error} type="error"/>
      )}
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
            extraCaption={formatTimeout(data.modifyTime)}
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
  return <Link to={`/discs/${disc.id}`}>{titleString(disc)}</Link>
}
