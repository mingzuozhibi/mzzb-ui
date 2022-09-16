import { useAppSelector } from '#A/hooks'
import { MzLink } from '#C/link/MzLink'
import { MzHeader } from '#C/header/MzHeader'
import { useAjax } from '#H/useAjax'
import { useForm } from '#H/useFrom'
import { useOnceRequest } from '#H/useOnce'
import { fetchResult } from '#U/fetch/fetchResult'
import { Button, Input, Modal, Radio } from 'antd'
import { Link } from 'react-router-dom'

import { linkToAmazon, linkToRecords } from '#A/links'
import { IDisc } from '#T/disc'
import { discTitle } from '#T/disc-utils'
import { formatNumber } from '#U/format'
import dayjs from 'dayjs'

interface FormEdit {
  rank?: string
  titlePc?: string
  discType?: string
  releaseDate?: string
}

interface Props {
  url: string
}

export function DiscDetail({ url }: Props) {
  const { form, setForm, onValueChange } = useForm<FormEdit>({})
  const [isPut, doPut] = useAjax<IDisc>('put')
  const [isPatch, doPatch] = useAjax<IDisc>('patch')

  const hasBasic = useAppSelector((state) => state.session.hasBasic)
  const { data: disc, ...state } = useOnceRequest(
    () => fetchResult<IDisc>(url).then((result) => result.data),
    {
      onSuccess: (disc) => {
        const { titlePc, discType, releaseDate } = disc!
        setForm({ titlePc, discType, releaseDate })
      },
    }
  )

  function doEditDisc() {
    if (!form.releaseDate) {
      Modal.warning({ title: '请检查输入项', content: '请输入发售日期' })
      return
    }
    if (!form.releaseDate.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/g)) {
      Modal.warning({ title: '请检查输入项', content: '格式应该为: YYYY/M/D' })
      return
    }
    if (disc != null) {
      doPut(`/api/discs/${disc.id}`, '编辑碟片', {
        body: form,
        onSuccess: state.mutate,
      })
    }
  }

  function doEditRank() {
    if (!form.rank) {
      Modal.warning({ title: '请检查输入项', content: '请输入碟片排名' })
      return
    }
    if (!form.rank.match(/^[0-9]+$/) || parseInt(form.rank) <= 0) {
      Modal.warning({ title: '请检查输入项', content: '碟片排名必须是正整数' })
      return
    }
    if (disc != null) {
      doPatch(`/api/discs/${disc.id}`, '更新排名', {
        body: { rank: form.rank },
        onSuccess: state.mutate,
      })
    }
  }

  const title = disc ? discTitle(disc) : undefined

  return (
    <div className="disc-detail" style={{ maxWidth: 650 }}>
      <MzHeader title={{ prefix: '碟片信息', suffix: title }} state={state} />
      {disc && (
        <>
          <div className="input-wrapper">
            <div className="input-label">
              <span>日文标题</span>
              <span style={{ marginLeft: 20 }}>{toAmazon(disc.asin)}</span>
            </div>
            <Input.TextArea readOnly={true} autoSize={true} value={disc.title} />
          </div>
          {hasBasic && (
            <div className="input-wrapper">
              <div className="input-label">
                <span>手动更新</span>
                <span style={{ marginLeft: 20 }}>
                  <Button type="primary" loading={isPatch} onClick={() => doEditRank()}>
                    提交排名
                  </Button>
                </span>
              </div>
              <Input type="number" onChange={onValueChange('rank')} />
            </div>
          )}
          <div className="input-wrapper">
            <div className="input-label">
              <span>中文标题</span>
              <span style={{ marginLeft: 20 }}>{toRecords(disc.id)}</span>
            </div>
            <Input.TextArea
              autoSize={true}
              value={form.titlePc}
              onChange={onValueChange('titlePc')}
            />
          </div>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input readOnly={true} addonBefore="Id" style={{ width: 100 }} value={disc.id} />
              <Input
                readOnly={true}
                addonBefore="Asin"
                style={{ width: 180, marginLeft: 12 }}
                value={disc.asin}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="当前"
                style={{ width: 140 }}
                value={formatRank(disc.thisRank)}
              />
              <Input
                readOnly={true}
                addonBefore="前回"
                style={{ width: 140, marginLeft: 12 }}
                value={formatRank(disc.prevRank)}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="累积PT"
                style={{ width: 140 }}
                value={disc.totalPt}
              />
              <Input
                readOnly={true}
                addonBefore="预测PT"
                style={{ width: 140, marginLeft: 12 }}
                value={disc.guessPt}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="日增PT"
                style={{ width: 140 }}
                value={disc.todayPt}
              />
              <Input
                readOnly={true}
                addonBefore="Nico预约"
                style={{ width: 140, marginLeft: 12 }}
                value={disc.nicoBook}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                addonBefore="发售"
                style={{ width: 160 }}
                value={form.releaseDate}
                onChange={onValueChange('releaseDate')}
              />
              <Input
                readOnly={true}
                addonBefore="天数"
                style={{ width: 120, marginLeft: 12 }}
                value={disc.surplusDays}
              />
            </div>
          </Input.Group>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="创建时间"
              style={{ width: 270 }}
              value={formatDate(disc.createTime)}
            />
          </div>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="刷新时间"
              style={{ width: 270 }}
              value={formatDate(disc.updateTime)}
            />
          </div>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="修改时间"
              style={{ width: 270 }}
              value={formatDate(disc.modifyTime)}
            />
          </div>
          <div className="input-wrapper">
            <Radio.Group value={form.discType} onChange={onValueChange('discType')}>
              <Radio.Button value="Cd">CD</Radio.Button>
              <Radio.Button value="Bluray">BD</Radio.Button>
              <Radio.Button value="Dvd">DVD</Radio.Button>
              <Radio.Button value="Auto">自动</Radio.Button>
              <Radio.Button value="Other">未知</Radio.Button>
            </Radio.Group>
            {hasBasic && (
              <div style={{ marginTop: 20 }}>
                <Button loading={isPut} type="primary" onClick={doEditDisc}>
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
  return <MzLink href={linkToAmazon(asin)} title="点击打开日亚页面" />
}

function toRecords(id: number) {
  return <Link to={linkToRecords(id)}>点击查看所有排名</Link>
}
