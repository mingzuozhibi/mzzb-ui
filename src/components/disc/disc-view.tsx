import * as React from 'react'
import { Button, Input, Modal, Select } from 'antd'
import { DiscModel } from './reducer'
import { Session } from '../../App/reducer'

interface FormEdit {
  titlePc?: string
  titleMo?: string
  discType?: string
  updateType?: string
  releaseDate?: string
}

const formEdit: FormEdit = {}

interface Props {
  detail: DiscModel
  session: Session
  editModel: (id: number, model: {}) => void
}

export function DiscView(props: Props) {

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

  return (
    <div className="disc-view-content">
      <div className="input-wrapper">
        <div className="input-label">原标题</div>
        <Input.TextArea
          autosize={true}
          disabled={true}
          defaultValue={props.detail.title}
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
            disabled={true}
            addonBefore="Id"
            style={{width: 100}}
            defaultValue={props.detail.id}
          />
          <Input
            disabled={true}
            addonBefore="Asin"
            style={{width: 180, marginLeft: 12}}
            defaultValue={props.detail.asin}
          />
        </div>
      </Input.Group>
      <Input.Group compact={true}>
        <div className="input-wrapper">
          <Input
            addonBefore="发售"
            style={{width: 150}}
            onChange={e => formEdit.releaseDate = e.target.value}
            defaultValue={formEdit.releaseDate}
          />
          <Input
            disabled={true}
            addonBefore="剩余天数"
            style={{width: 130, marginLeft: 12}}
            defaultValue={props.detail.surplusDays}
          />
        </div>
      </Input.Group>
      <Input.Group compact={true}>
        <div className="input-wrapper">
          <Input
            disabled={true}
            addonBefore="当前"
            style={{width: 140}}
            defaultValue={props.detail.thisRank}
          />
          <Input
            disabled={true}
            addonBefore="前回"
            style={{width: 140, marginLeft: 12}}
            defaultValue={props.detail.prevRank}
          />
        </div>
      </Input.Group>
      <Input.Group compact={true}>
        <div className="input-wrapper">
          <Input
            disabled={true}
            addonBefore="累积PT"
            style={{width: 140}}
            defaultValue={props.detail.totalPt}
          />
          <Input
            disabled={true}
            addonBefore="Nico预订"
            style={{width: 140, marginLeft: 12}}
            defaultValue={props.detail.nicoBook}
          />
        </div>
      </Input.Group>
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
      </div>
      {props.session.userRoles.find(role => role === 'ROLE_BASIC') && (
        <div className="input-wrapper">
          <Button type="danger" onClick={editModel}>提交修改</Button>
        </div>
      )}
    </div>
  )
}
