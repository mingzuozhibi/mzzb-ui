import * as React from 'react'
import { Button, Input, Modal, Radio } from 'antd'
import { PageInfo } from '../../common/route-infos'
import { Icon } from '../../lib/icon'
import { viewTypes } from './reducer'

interface FormSave {
  key?: string
  title?: string
  viewType?: string
}

const formSave: FormSave = {}

interface AdminSakuraSaveProps {
  pageInfo: PageInfo
  saveModel: (model: {}) => void
}

export function AdminSakuraSave(props: AdminSakuraSaveProps) {

  function saveModel() {
    const key = formSave.key
    const title = formSave.title
    const viewType = formSave.viewType

    if (!key) {
      Modal.warning({title: '请检查输入项', content: `${props.pageInfo.modelName}索引必须输入`})
      return
    }

    if (!title) {
      Modal.warning({title: '请检查输入项', content: `${props.pageInfo.modelName}标题必须输入`})
      return
    }

    if (!viewType) {
      Modal.warning({title: '请检查输入项', content: '你必须选择一个列表类型'})
      return
    }

    props.saveModel({key, title, viewType})
  }

  return (
    <div className="admin-sakura-save-content">
      <div className="input-wrapper">
        <Input
          prefix={<Icon type="key"/>}
          defaultValue={formSave.key}
          onChange={(e) => formSave.key = e.target.value}
          placeholder={`请输入${props.pageInfo.modelName}索引`}
        />
      </div>
      <div className="input-wrapper">
        <Input
          prefix={<Icon type="tag-o"/>}
          defaultValue={formSave.title}
          onChange={(e) => formSave.title = e.target.value}
          placeholder={`请输入${props.pageInfo.modelName}标题`}
        />
      </div>
      <div className="input-wrapper">
        <span className="input-label">列表类型</span>
        <Radio.Group
          options={viewTypes}
          defaultValue={formSave.viewType}
          onChange={e => formSave.viewType = e.target.value}
        />
      </div>
      <div className="input-wrapper">
        <Button type="primary" onClick={saveModel}>添加{props.pageInfo.modelName}</Button>
      </div>
    </div>
  )
}
