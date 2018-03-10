import * as React from 'react'
import { Button, Input, Modal, Select, Tabs } from 'antd'
import { ViewportProps, withViewport } from '../../hoc/Viewport'
import { DiscOfRanksModel } from './reducer'
import { formatNumber } from '../../utils/format'

interface FormEdit {
  titlePc?: string
  titleMo?: string
  discType?: string
  updateType?: string
  releaseDate?: string
}

const formEdit: FormEdit = {}

interface Props {
  detail: DiscOfRanksModel
  editModel: (id: number, model: {}) => void
  hasBasicRole: boolean
}

function DiscView(props: Props & ViewportProps) {

  function editModel() {
    if (!formEdit.releaseDate) {
      Modal.warning({title: '请检查输入项', content: `你必须输入发售日期`})
      return
    }

    if (!formEdit.releaseDate.match(/\d{4}-\d{2}-\d{2}/)) {
      Modal.warning({title: '请检查输入项', content: `你输入的发售日期格式不正确，应该为：yyyy-MM-dd`})
      return
    }

    props.editModel(props.detail.id, formEdit)
  }

  formEdit.titlePc = props.detail.titlePc
  formEdit.titleMo = props.detail.titleMo
  formEdit.discType = props.detail.discType
  formEdit.updateType = props.detail.updateType
  formEdit.releaseDate = props.detail.releaseDate

  function toSakura() {
    return <a href={`http://rankstker.net/show.cgi?n=${props.detail.asin}`} target="_blank">Sakura链接</a>
  }

  function toAmazon() {
    return <a href={`http://www.amazon.co.jp/dp/${props.detail.asin}`} target="_blank">Amazon链接</a>
  }

  function formatTitle(t: DiscOfRanksModel) {
    if (props.viewport.width > 600) {
      return t.titlePc || t.title
    } else {
      return t.titleMo || t.titlePc || t.title
    }
  }

  return (
    <div className="disc-view-content">
      <Tabs>
        <Tabs.TabPane key={1} tab="销量排名">
          <div className="input-wrapper">
            <div className="input-label">
              <span>碟片标题</span>
              <span style={{marginLeft: 20}}>{toSakura()}</span>
              <span style={{marginLeft: 20}}>{toAmazon()}</span>
            </div>
            <Input.TextArea
              readOnly={true}
              autosize={true}
              style={{maxWidth: 292}}
              value={formatTitle(props.detail)}
            />
          </div>
          <div className="input-wrapper">
            <div className="input-label">
              <span>最近5个有效排名(发售日之前)</span>
            </div>
            <Input.TextArea
              readOnly={true}
              autosize={true}
              style={{maxWidth: 292}}
              value={props.detail.ranks.map(rank => (
                `${rank.date} ${rank.hour}时 ${formatRank(rank.rank)}`
              )).join('\n')}
            />
          </div>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="当前"
                style={{width: 140}}
                value={formatRank(props.detail.thisRank)}
              />
              <Input
                readOnly={true}
                addonBefore="前回"
                style={{width: 140, marginLeft: 12}}
                value={formatRank(props.detail.prevRank)}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="累积PT"
                style={{width: 140}}
                value={props.detail.totalPt}
              />
              <Input
                readOnly={true}
                addonBefore="预测PT"
                style={{width: 140, marginLeft: 12}}
                value={props.detail.guessPt}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="日增PT"
                style={{width: 140}}
                value={props.detail.todayPt}
              />
              <Input
                readOnly={true}
                addonBefore="Nico预约"
                style={{width: 140, marginLeft: 12}}
                value={props.detail.nicoBook}
              />
            </div>
          </Input.Group>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="发售"
                style={{width: 160}}
                value={props.detail.releaseDate}
              />
              <Input
                readOnly={true}
                addonBefore="天数"
                style={{width: 120, marginLeft: 12}}
                value={props.detail.surplusDays}
              />
            </div>
          </Input.Group>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="创建时间"
              style={{width: 270}}
              value={formatDate(props.detail.createTime)}
            />
          </div>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="刷新时间"
              style={{width: 270}}
              value={formatDate(props.detail.updateTime)}
            />
          </div>
          <div className="input-wrapper">
            <Input
              readOnly={true}
              addonBefore="修改时间"
              style={{width: 270}}
              value={formatDate(props.detail.modifyTime)}
            />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane key={2} tab="基本信息">
          <div className="input-wrapper">
            <div className="input-label">原标题</div>
            <Input.TextArea
              readOnly={true}
              autosize={true}
              value={props.detail.title}
            />
          </div>
          <div className="input-wrapper">
            <div className="input-label">长标题</div>
            <Input.TextArea
              autosize={true}
              onChange={e => formEdit.titlePc = e.target.value}
              defaultValue={formEdit.titlePc}
            />
          </div>
          <div className="input-wrapper">
            <div className="input-label">短标题</div>
            <Input.TextArea
              autosize={true}
              onChange={e => formEdit.titleMo = e.target.value}
              defaultValue={formEdit.titleMo}
            />
          </div>
          <Input.Group compact={true}>
            <div className="input-wrapper">
              <Input
                readOnly={true}
                addonBefore="Id"
                style={{width: 100}}
                value={props.detail.id}
              />
              <Input
                readOnly={true}
                addonBefore="Asin"
                style={{width: 180, marginLeft: 12}}
                value={props.detail.asin}
              />
            </div>
          </Input.Group>
          <div className="input-wrapper">
            <span className="input-label">发售日期</span>
            <Input
              style={{width: 160}}
              onChange={e => formEdit.releaseDate = e.target.value}
              defaultValue={formEdit.releaseDate}
            />
          </div>
          <div className="input-wrapper">
            <span className="input-label">碟片类型</span>
            <Select
              style={{width: 160}}
              defaultValue={formEdit.discType}
              onChange={value => formEdit.discType = value.toString()}
            >
              <Select.Option value="Bluray">Blu-ray</Select.Option>
              <Select.Option value="Dvd">DVD</Select.Option>
              <Select.Option value="Box">BOX</Select.Option>
              <Select.Option value="Cd">CD</Select.Option>
              <Select.Option value="Other">未知</Select.Option>
            </Select>
          </div>
          <div className="input-wrapper">
            <span className="input-label">更新模式</span>
            <Select
              style={{width: 160}}
              defaultValue={formEdit.updateType}
              onChange={value => formEdit.updateType = value.toString()}
            >
              <Select.Option value="Sakura">只从Sakura更新</Select.Option>
              <Select.Option value="Amazon">只从Amazon更新</Select.Option>
              <Select.Option value="Both">自动更新模式</Select.Option>
              <Select.Option value="None">不进行更新</Select.Option>
            </Select>
            {props.hasBasicRole && (
              <div>
                <div style={{marginTop: 20}}>
                  <Button type="danger" onClick={editModel}>提交修改</Button>
                </div>
              </div>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

function formatDate(time?: number) {
  return time == null ? '无' : new Date(time).toLocaleString()
}

function formatRank(rank?: number) {
  return `${(rank ? formatNumber(rank, '****') : '----')}位`
}

const WithViewport = withViewport<Props>(DiscView)

export { WithViewport as DiscView }
