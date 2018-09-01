import * as React from 'react'
import { DiscModel, SakuraOfDiscsModel } from './reducer-discs'
import { ViewportProps, withViewport } from '../../hoc/Viewport'
import { formatTimeout } from '../../utils/format'
import { Button, Input, Modal } from 'antd'
import { Column, Table } from '../../lib/table'
import { Command } from '../../lib/command'
import { Link } from 'react-router-dom'

interface FormSearch {
  asin?: string
}

const formSearch: FormSearch = {}

interface Props {
  detail: SakuraOfDiscsModel
  addDiscs: DiscModel[]
  pushDiscs: (id: number, pid: number) => void
  dropDiscs: (id: number, pid: number) => void
  searchDisc: (id: number, asin: string) => void
}

function AdminSakuraDiscs(props: Props & ViewportProps) {

  function searchDisc() {
    const asin = formSearch.asin

    if (!asin) {
      Modal.warning({title: '请检查输入项', content: `碟片ASIN必须输入`})
      return
    }

    if (props.addDiscs.some(t => t.asin === asin)) {
      Modal.warning({title: '请检查输入项', content: `该碟片已存在于待选列表`})
      return
    }

    if (props.detail.discs.some(t => t.asin === asin)) {
      Modal.warning({title: '请检查输入项', content: `该碟片已存在于当前列表`})
      return
    }

    props.searchDisc(props.detail.id, asin)
  }

  function getColumns(extraColumn: Column<DiscModel>): Column<DiscModel>[] {
    return [
      {
        key: 'asin',
        title: 'ASIN',
        format: (t) => t.asin,
      },
      {
        key: 'surplusDays',
        title: '天数',
        format: (t) => `${t.surplusDays}天`,
        compare: (a, b) => {
          if (a.surplusDays !== b.surplusDays) {
            return a.surplusDays - b.surplusDays
          }
          return formatTitle(a).localeCompare(formatTitle(b))
        },
      },
      {
        key: 'title',
        title: '碟片标题',
        format: (t) => <Link to={`/disc/${t.id}`}>{formatTitle(t)}</Link>,
        compare: (a, b) => formatTitle(a).localeCompare(formatTitle(b)),
      },
      extraColumn
    ]
  }

  function formatTitle(t: DiscModel) {
    if (props.viewport.width > 600) {
      return t.titlePc || t.title
    } else {
      return t.titleMo || t.titlePc || t.title
    }
  }

  function getPushControl() {
    const pushDisc = (t: DiscModel) => () => props.pushDiscs(props.detail.id, t.id)
    return {
      key: 'control',
      title: '功能',
      format: (t: DiscModel) => <Command onClick={pushDisc(t)}>添加</Command>
    }
  }

  function getDropControl() {
    const dropDisc = (t: DiscModel) => () => props.dropDiscs(props.detail.id, t.id)
    return {
      key: 'control',
      title: '功能',
      format: (t: DiscModel) => <Command onClick={dropDisc(t)}>移除</Command>
    }
  }

  return (
    <div className="admin-sakura-discs-content">
      <div>
        <div className="input-wrapper">
          <Input
            addonBefore="ASIN"
            defaultValue={formSearch.asin}
            onChange={e => formSearch.asin = e.target.value}
            placeholder="请输入ASIN"
          />
        </div>
        <div className="input-wrapper">
          <Button onClick={searchDisc}>查找碟片</Button>
        </div>
      </div>
      {props.addDiscs && (
        <Table
          title="待选列表"
          rows={props.addDiscs}
          columns={getColumns(getPushControl())}
        />
      )}
      <Table
        name={`admin-sakura-discs-${props.detail.key}`}
        title={props.detail.title}
        subtitle={formatTimeout(props.detail.modifyTime)}
        rows={props.detail.discs}
        columns={getColumns(getDropControl())}
      />
    </div>
  )
}

const WithViewport = withViewport<Props>(AdminSakuraDiscs)

export { WithViewport as AdminSakuraDiscs }
