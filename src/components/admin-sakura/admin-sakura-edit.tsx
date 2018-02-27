import * as React from 'react'
import { Button, Checkbox, Input, Modal, Radio } from 'antd'
import { AdminSakuraModel } from './reducer'
import { Icon } from '../../lib/icon'
import { PageInfo } from '../../common/root-reducer'

interface FormEdit {
  key?: string
  title?: string
  enabled?: boolean
  viewType?: string
}

const formEdit: FormEdit = {}

interface AdminSakuraEditProps {
  detail: AdminSakuraModel
  pageInfo: PageInfo
  editModel: (model: {}) => void
}

export function AdminSakuraEdit(props: AdminSakuraEditProps) {

  function editModel() {
    const key = formEdit.key
    const title = formEdit.title
    const enabled = formEdit.enabled
    const viewType = formEdit.viewType

    if (!key) {
      Modal.warning({title: '请检查输入项', content: `你必须输入${props.pageInfo.modelName}索引`})
      return
    }

    if (!title) {
      Modal.warning({title: '请检查输入项', content: `你必须输入${props.pageInfo.modelName}标题`})
      return
    }

    props.editModel({id: props.detail.id, key, title, viewType, enabled})
  }

  formEdit.key = props.detail.key
  formEdit.title = props.detail.title
  formEdit.enabled = props.detail.enabled
  formEdit.viewType = props.detail.viewType

  return (
    <div className="admin-sakura-edit-content">
      <div className="input-wrapper">
        <Input
          prefix={<Icon type="key"/>}
          defaultValue={formEdit.key}
          onChange={e => formEdit.key = e.target.value}
          placeholder={`请输入${props.pageInfo.modelName}索引`}
        />
      </div>
      <div className="input-wrapper">
        <Input
          prefix={<Icon type="tag-o"/>}
          defaultValue={formEdit.title}
          onChange={e => formEdit.title = e.target.value}
          placeholder={`请输入${props.pageInfo.modelName}标题`}
        />
      </div>
      <div className="input-wrapper">
        <span className="input-label">显示类型</span>
        <Radio.Group
          options={['SakuraList', 'PublicList', 'PrivateList']}
          defaultValue={formEdit.viewType}
          onChange={e => formEdit.viewType = e.target.value}
        />
      </div>
      <div className="input-wrapper">
        <Checkbox
          defaultChecked={formEdit.enabled}
          onChange={e => formEdit.enabled = e.target.checked}
        >
          启用
        </Checkbox>
      </div>
      <div className="input-wrapper">
        <Button type="primary" onClick={editModel}>保存修改</Button>
      </div>
    </div>
  )
}
