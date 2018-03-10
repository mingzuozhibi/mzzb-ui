import * as React from 'react'
import { DiscOfRecordsModel, RecordModel } from './reducer'
import { Button, Input, Modal, Tabs } from 'antd'
import { Column, Table } from '../../lib/table'

interface FormRecord {
  text?: string
}

const formRecord: FormRecord = {}

interface Props {
  detail: DiscOfRecordsModel
  mergeRanks: (id: number, model: {}) => void
  mergePts: (id: number, model: {}) => void
}

export function DiscRecords(props: Props) {

  function getColumns(): Column<RecordModel>[] {
    return [
      {
        key: 'id',
        title: '#',
        format: (t, i) => i + 1
      },
      {
        key: 'date',
        title: '日期',
        format: (t) => t.date
      },
      {
        key: 'todayPt',
        title: '日增PT',
        format: (t) => t.todayPt
      },
      {
        key: 'totalPt',
        title: '累积PT',
        format: (t) => t.totalPt
      },
      {
        key: 'averRank',
        title: '平均排名',
        format: (t) => t.averRank || '-'
      },
    ]
  }

  function formatTitle(t: DiscOfRecordsModel) {
    return t.titlePc || t.title
  }

  function mergeRanks() {
    if (!formRecord.text) {
      Modal.warning({title: '请检查输入项', content: `你必须输入排名数据`})
      return
    }

    props.mergeRanks(props.detail.id, formRecord)
  }

  function mergePts() {
    if (!formRecord.text) {
      Modal.warning({title: '请检查输入项', content: `你必须输入PT数据`})
      return
    }

    props.mergePts(props.detail.id, formRecord)
  }

  formRecord.text = undefined

  return (
    <div className="disc-records-content">
      <Tabs>
        <Tabs.TabPane key={1} tab="排名数据">
          <div style={{fontSize: 18, padding: 10}}>
            {formatTitle(props.detail)}
          </div>
          <Table
            rows={props.detail.records}
            columns={getColumns()}
          />
        </Tabs.TabPane>
        <Tabs.TabPane key={2} tab="提交排名">
          <div className="input-wrapper">
            <Button type="danger" onClick={mergeRanks}>提交排名</Button>
          </div>
          <div className="input-wrapper">
            <div className="input-label">
              <span style={{marginRight: 10}}>Sakura历史排名</span>
              <a target="_blank" href={toSakuraRank(props.detail.asin)}>
                点击这里打开Sakura网站
              </a>
            </div>
            <Input.TextArea
              autosize={true}
              onChange={e => formRecord.text = e.target.value}
              defaultValue={formRecord.text}
              placeholder="你可以从Sakura网站手动复制排名数据到这里"
            />
          </div>
          <div className="input-wrapper">
            <Button type="danger" onClick={mergeRanks}>提交排名</Button>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane key={3} tab="提交PT">
          <div className="input-wrapper">
            <Button type="danger" onClick={mergePts}>提交PT</Button>
          </div>
          <div className="input-wrapper">
            <div className="input-label">
              <span style={{marginRight: 10}}>Sakura累积PT</span>
              <a target="_blank" href={toSakuraPt(props.detail.asin)}>
                点击这里打开Sakura网站
              </a>
            </div>
            <Input.TextArea
              autosize={true}
              onChange={e => formRecord.text = e.target.value}
              defaultValue={formRecord.text}
              placeholder="你可以从Sakura网站手动复制PT数据到这里"
            />
          </div>
          <div className="input-wrapper">
            <Button type="danger" onClick={mergePts}>提交PT</Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

function toSakuraRank(asin: string) {
  return `http://rankstker.net/show.cgi?n=${asin}&rg=100000&li=&tn=1#ui-tab`
}

function toSakuraPt(asin: string) {
  return `http://rankstker.net/show.cgi?n=${asin}&tn=2#ui-tab`
}
