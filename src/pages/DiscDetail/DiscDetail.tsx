import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Alert, Button, Input, Modal, PageHeader, Radio } from 'antd'

import { useData } from '../../hooks/useData'
import { useDocumentTitle } from '../../hooks/hooks'
import { Outlink } from '../../comps/html'
import { formatNumber } from '../../funcs/format'

interface Disc {
  id: number
  asin: string
  title: string
  titlePc?: string
  todayPt?: number
  totalPt?: number
  guessPt?: number
  nicoBook?: number
  thisRank?: number
  prevRank?: number
  discType: string
  createTime: number
  updateTime?: number
  modifyTime?: number
  releaseDate: string
  surplusDays: number
}

interface Form {
  titlePc?: string
  discType?: string
  releaseDate?: string
}

interface Props {
  hasRole: boolean
}

export function DiscDetail(props: Props & RouteComponentProps<{ id: string }>) {

  const {hasRole, match, history} = props

  const [{error, data}, {loading}, {doEdit}] = useData<Disc>(`/api/discs/${match.params.id}`)

  useDocumentTitle(data ? formatTitle(data) : '碟片信息载入中')

  const form: Form = {}

  if (data) {
    form.titlePc = data.titlePc
    form.discType = data.discType
    form.releaseDate = data.releaseDate
  }

  function submitForm() {
    if (!form.releaseDate) {
      Modal.warning({title: '请检查输入项', content: `你必须输入发售日期`})
      return
    }
    if (!form.releaseDate.match(/\d{4}-\d{2}-\d{2}/)) {
      Modal.warning({title: '请检查输入项', content: `你输入的发售日期格式不正确，应该为：yyyy-MM-dd`})
      return
    }
    doEdit(`/api/discs2/${data!.id}`, form)
  }

  return (
    <div className="DiscDetail">
      <PageHeader title="碟片信息" onBack={() => history.goBack()}/>
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <>
          <div className="input-wrapper">
            <div className="input-label">
              <span>日文标题</span>
              <span style={{marginLeft: 20}}>{toAmazon(data.asin)}</span>
            </div>
            <Input.TextArea
              readOnly={true}
              autosize={true}
              value={data.title}
            />
          </div>
          <div className="input-wrapper">
            <div className="input-label">
              <span>中文标题</span>
              <span style={{marginLeft: 20}}>{toRecords(data.id)}</span>
            </div>

            <Input.TextArea
              autosize={true}
              onChange={e => form.titlePc = e.target.value}
              defaultValue={form.titlePc}
            />
          </div>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="Id"
                style={{width: 100}}
                value={data.id}
              />
              <Input
                readOnly={true}
                addonBefore="Asin"
                style={{width: 180, marginLeft: 12}}
                value={data.asin}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="当前"
                style={{width: 140}}
                value={formatRank(data.thisRank)}
              />
              <Input
                readOnly={true}
                addonBefore="前回"
                style={{width: 140, marginLeft: 12}}
                value={formatRank(data.prevRank)}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="累积PT"
                style={{width: 140}}
                value={data.totalPt}
              />
              <Input
                readOnly={true}
                addonBefore="预测PT"
                style={{width: 140, marginLeft: 12}}
                value={data.guessPt}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="日增PT"
                style={{width: 140}}
                value={data.todayPt}
              />
              <Input
                readOnly={true}
                addonBefore="Nico预约"
                style={{width: 140, marginLeft: 12}}
                value={data.nicoBook}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                addonBefore="发售"
                style={{width: 160}}
                defaultValue={form.releaseDate}
                onChange={e => form.releaseDate = e.target.value}
              />
              <Input
                readOnly={true}
                addonBefore="天数"
                style={{width: 120, marginLeft: 12}}
                value={data.surplusDays}
              />
            </div>
          </Input.Group>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="创建时间"
              style={{width: 270}}
              value={formatDate(data.createTime)}
            />
          </div>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="刷新时间"
              style={{width: 270}}
              value={formatDate(data.updateTime)}
            />
          </div>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="修改时间"
              style={{width: 270}}
              value={formatDate(data.modifyTime)}
            />
          </div>
          <div className="input-wrapper">
            <Radio.Group
              defaultValue={form.discType}
              onChange={e => form.discType = e.target.value}
            >
              <Radio.Button value="Cd">CD</Radio.Button>
              <Radio.Button value="Bluray">BD</Radio.Button>
              <Radio.Button value="Dvd">DVD</Radio.Button>
              <Radio.Button value="Auto">自动</Radio.Button>
              <Radio.Button value="Other">未知</Radio.Button>
            </Radio.Group>
            {hasRole && (
              <div style={{marginTop: 20}}>
                <Button loading={loading} type="primary" onClick={submitForm}>提交修改</Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function formatDate(time?: number) {
  return time == null ? '无' : new Date(time).toLocaleString()
}

function formatRank(rank?: number) {
  return `${(rank ? formatNumber(rank, '****') : '----')}位`
}

function formatTitle(t: Disc) {
  return `碟片信息：${t.titlePc || t.title}`
}

function toAmazon(asin: string) {
  return <Outlink href={`http://www.amazon.co.jp/dp/${asin}`} title="点击打开日亚页面"/>
}

function toRecords(id: number) {
  return <Link to={`/discs/${id}/records`}>点击查看所有排名</Link>
}
