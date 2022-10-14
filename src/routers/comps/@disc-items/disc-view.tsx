import { MzLink } from '#CC/link/MzLink'
import { Input, Radio } from 'antd'
import { Link } from 'react-router-dom'

import { IDisc } from '#DT/disc'
import { formatNumber } from '#RU/format'
import { linkToAmazon, linkToDiscs } from '#RU/links'
import dayjs from 'dayjs'

interface Props {
  disc: IDisc
}

export function DiscView({ disc }: Props) {
  return (
    <div className="disc-view" style={{ maxWidth: 450 }}>
      <div className="input-warpper">
        <div className="input-label">
          <span>日文标题</span>
          <span style={{ marginLeft: 20 }}>{toAmazon(disc.asin)}</span>
        </div>
        <Input.TextArea readOnly={true} autoSize={true} value={disc.title} />
      </div>
      <div className="input-warpper">
        <div className="input-label">
          <span>中文标题</span>
          <span style={{ marginLeft: 20 }}>{toRecords(disc.id)}</span>
        </div>
        <Input.TextArea autoSize={true} readOnly={true} value={disc.titlePc} />
      </div>
      <div className="input-warpper">
        <Input readOnly={true} addonBefore="Id" style={{ width: 100 }} value={disc.id} />
        <Input
          readOnly={true}
          addonBefore="Asin"
          style={{ width: 180, marginLeft: 12 }}
          value={disc.asin}
        />
      </div>
      <div className="input-warpper">
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
      <div className="input-warpper">
        <Input readOnly={true} addonBefore="累积PT" style={{ width: 140 }} value={disc.totalPt} />
        <Input
          readOnly={true}
          addonBefore="预测PT"
          style={{ width: 140, marginLeft: 12 }}
          value={disc.guessPt}
        />
      </div>
      <div className="input-warpper">
        <Input readOnly={true} addonBefore="日增PT" style={{ width: 140 }} value={disc.todayPt} />
        <Input
          readOnly={true}
          addonBefore="Nico预约"
          style={{ width: 140, marginLeft: 12 }}
          value={disc.nicoBook}
        />
      </div>
      <div className="input-warpper">
        <Input readOnly={true} addonBefore="发售" style={{ width: 160 }} value={disc.releaseDate} />
        <Input
          readOnly
          addonBefore="天数"
          style={{ width: 120, marginLeft: 12 }}
          value={disc.surplusDays}
        />
      </div>
      <div className="input-warpper">
        <Radio.Group value={disc.discType}>
          <Radio.Button value="Cd">CD</Radio.Button>
          <Radio.Button value="Bluray">BD</Radio.Button>
          <Radio.Button value="Dvd">DVD</Radio.Button>
          <Radio.Button value="Auto">自动</Radio.Button>
          <Radio.Button value="Other">未知</Radio.Button>
        </Radio.Group>
      </div>
      <div className="input-warpper">
        <Input
          readOnly={true}
          addonBefore="创建"
          style={{ width: 292 }}
          value={formatDate(disc.createTime)}
        />
      </div>
      <div className="input-warpper">
        <Input
          readOnly={true}
          addonBefore="刷新"
          style={{ width: 292 }}
          value={formatDate(disc.updateTime)}
        />
      </div>
      <div className="input-warpper">
        <Input
          readOnly={true}
          addonBefore="修改"
          style={{ width: 292 }}
          value={formatDate(disc.modifyTime)}
        />
      </div>
    </div>
  )
}

function formatDate(time?: number) {
  return time == null
    ? '无'
    : `${dayjs(time).format('YYYY-MM-DD HH:mm:ss')}  ( ${dayjs(time).fromNow()} )`
}

function formatRank(rank?: number) {
  return `${rank ? formatNumber(rank, '****') : '----'}位`
}

function toAmazon(asin: string) {
  return <MzLink href={linkToAmazon(asin)} title="点击打开日亚页面" />
}

function toRecords(id: number) {
  return <Link to={linkToDiscs(`/${id}/records`)}>点击查看所有排名</Link>
}
