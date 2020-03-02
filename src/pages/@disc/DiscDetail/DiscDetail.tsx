import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Modal, Radio } from 'antd'
import { UseData } from '../../../hooks/useData'
import { formatNumber } from '../../../funcs/format'
import { CustomLink } from '../../../comps/CustomLink'
import { CustomHeader } from '../../../comps/CustomHeader'
import { discTitle } from '../../@funcs'
import { Disc } from '../../@types'

export type Data = Disc

interface Form {
  titlePc?: string
  discType?: string
  releaseDate?: string
}

interface Props {
  useDate: UseData<Data>
  isBasic: boolean
}

export function DiscDetail({useDate, isBasic}: Props) {

  const [{data, error}, {loading}, {doEdit}] = useDate
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
    doEdit(`/api/discs/${data!.id}`, form)
  }

  const title = data ? `碟片信息：${discTitle(data)}` : '载入中'

  return (
    <div className="DiscDetail">
      <CustomHeader header="碟片信息" title={title} error={error}/>
      {data && (
        <>
          <div className="input-wrapper">
            <div className="input-label">
              <span>日文标题</span>
              <span style={{marginLeft: 20}}>{toAmazon(data.asin)}</span>
            </div>
            <Input.TextArea
              readOnly={true}
              autoSize={true}
              value={data.title}
            />
          </div>
          <div className="input-wrapper">
            <div className="input-label">
              <span>中文标题</span>
              <span style={{marginLeft: 20}}>{toRecords(data.id)}</span>
            </div>

            <Input.TextArea
              autoSize={true}
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
            {isBasic && (
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

function toAmazon(asin: string) {
  return <CustomLink href={`http://www.amazon.co.jp/dp/${asin}`} title="点击打开日亚页面"/>
}

function toRecords(id: number) {
  return <Link to={`/discs/${id}/records`}>点击查看所有排名</Link>
}
