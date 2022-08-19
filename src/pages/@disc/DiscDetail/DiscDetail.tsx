import { MzHeader } from '##/comps/header/MzHeader'
import { MzLink } from '##/comps/link/MzLink'
import { UseData } from '##/hooks'
import { formatNumber } from '#F/format'
import { request } from '#F/request'
import { discTitle } from '#P/@funcs'
import { Disc } from '#P/@types'
import { Button, Input, message, Modal, Radio } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link } from 'react-router-dom'

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

export function DiscDetail({ useDate, isBasic }: Props) {
  const [{ data, error }, { loading, refresh }, { doEdit }] = useDate
  const form: Form = {}
  const [rank, setRank] = useState<number>()

  if (data) {
    form.titlePc = data.titlePc
    form.discType = data.discType
    form.releaseDate = data.releaseDate
  }

  function submitForm() {
    if (!form.releaseDate) {
      Modal.warning({ title: '请检查输入项', content: `你必须输入发售日期` })
      return
    }
    if (!form.releaseDate.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) {
      Modal.warning({
        title: '请检查输入项',
        content: `你输入的发售日期格式不正确，应该为：YYYY/M/D`,
      })
      return
    }
    doEdit(`/api/discs/${data!.id}`, form)
  }

  function updateRank() {
    if (data?.asin && rank) {
      request(`/api/updateRank/${data?.asin}/${rank}`, {
        method: 'post',
      })
        .then(() => {
          message.success('提交排名成功')
          refresh()
        })
        .catch((e) => {
          Modal.warning({ title: '操作失败', content: e.message })
        })
    }
  }

  const title = data ? `碟片信息：${discTitle(data)}` : '载入中'

  return (
    <div className="DiscDetail">
      <MzHeader header="碟片信息" title={title} error={error} />
      {data && (
        <>
          <div className="input-wrapper">
            <div className="input-label">
              <span>日文标题</span>
              <span style={{ marginLeft: 20 }}>{toAmazon(data.asin)}</span>
            </div>
            <Input.TextArea readOnly={true} autoSize={true} value={data.title} />
          </div>
          {isBasic && (
            <div className="input-wrapper">
              <div className="input-label">
                <span>手动更新</span>
                <span style={{ marginLeft: 20 }}>
                  <Button type="primary" onClick={() => updateRank()}>
                    提交排名
                  </Button>
                </span>
              </div>
              <Input type="number" onChange={(e) => setRank(parseInt(e.target.value))} />
            </div>
          )}
          <div className="input-wrapper">
            <div className="input-label">
              <span>中文标题</span>
              <span style={{ marginLeft: 20 }}>{toRecords(data.id)}</span>
            </div>
            <Input.TextArea
              autoSize={true}
              onChange={(e) => (form.titlePc = e.target.value.trim())}
              defaultValue={form.titlePc}
            />
          </div>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input readOnly={true} addonBefore="Id" style={{ width: 100 }} value={data.id} />
              <Input
                readOnly={true}
                addonBefore="Asin"
                style={{ width: 180, marginLeft: 12 }}
                value={data.asin}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="当前"
                style={{ width: 140 }}
                value={formatRank(data.thisRank)}
              />
              <Input
                readOnly={true}
                addonBefore="前回"
                style={{ width: 140, marginLeft: 12 }}
                value={formatRank(data.prevRank)}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="累积PT"
                style={{ width: 140 }}
                value={data.totalPt}
              />
              <Input
                readOnly={true}
                addonBefore="预测PT"
                style={{ width: 140, marginLeft: 12 }}
                value={data.guessPt}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="日增PT"
                style={{ width: 140 }}
                value={data.todayPt}
              />
              <Input
                readOnly={true}
                addonBefore="Nico预约"
                style={{ width: 140, marginLeft: 12 }}
                value={data.nicoBook}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                addonBefore="发售"
                style={{ width: 160 }}
                defaultValue={form.releaseDate}
                onChange={(e) => (form.releaseDate = e.target.value.trim())}
              />
              <Input
                readOnly={true}
                addonBefore="天数"
                style={{ width: 120, marginLeft: 12 }}
                value={data.surplusDays}
              />
            </div>
          </Input.Group>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="创建时间"
              style={{ width: 270 }}
              value={formatDate(data.createTime)}
            />
          </div>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="刷新时间"
              style={{ width: 270 }}
              value={formatDate(data.updateTime)}
            />
          </div>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="修改时间"
              style={{ width: 270 }}
              value={formatDate(data.modifyTime)}
            />
          </div>
          <div className="input-wrapper">
            <Radio.Group
              defaultValue={form.discType}
              onChange={(e) => (form.discType = e.target.value)}
            >
              <Radio.Button value="Cd">CD</Radio.Button>
              <Radio.Button value="Bluray">BD</Radio.Button>
              <Radio.Button value="Dvd">DVD</Radio.Button>
              <Radio.Button value="Auto">自动</Radio.Button>
              <Radio.Button value="Other">未知</Radio.Button>
            </Radio.Group>
            {isBasic && (
              <div style={{ marginTop: 20 }}>
                <Button loading={loading} type="primary" onClick={submitForm}>
                  提交修改
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function formatDate(time?: number) {
  return time == null ? '无' : dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

function formatRank(rank?: number) {
  return `${rank ? formatNumber(rank, '****') : '----'}位`
}

function toAmazon(asin: string) {
  return <MzLink href={`http://www.amazon.co.jp/dp/${asin}`} title="点击打开日亚页面" />
}

function toRecords(id: number) {
  return <Link to={`/discs/${id}/records`}>点击查看所有排名</Link>
}
