import * as React from 'react'
import { Button, Checkbox, Input, Modal } from 'antd'
import { UserModel } from './reducer'
import { md5Password } from '../../utils/manager'
import { PageInfo } from '../../common/route-infos'
import { Icon } from '../../lib/icon'

interface FormEdit {
  username?: string
  password?: string
  enabled?: boolean
}

const formEdit: FormEdit = {}

interface AdminUserEditProps {
  detail: UserModel
  pageInfo: PageInfo
  editModel: (id: number, model: {}) => void
}

export function AdminUserEdit(props: AdminUserEditProps) {

  function editModel() {
    const username = formEdit.username
    const password = formEdit.password
    const enabled = formEdit.enabled

    if (!username) {
      Modal.warning({title: '请检查输入项', content: `你必须输入${props.pageInfo.modelName}名称`})
      return
    }

    const encode = password ? md5Password(username, password) : ''
    props.editModel(props.detail.id, {username, password: encode, enabled})
  }

  formEdit.username = props.detail.username
  formEdit.enabled = props.detail.enabled
  formEdit.password = ''

  return (
    <div className="admin-user-edit-content">
      <div>
        <div className="input-wrapper">
          <Input
            prefix={<Icon type="user"/>}
            defaultValue={formEdit.username}
            onChange={e => formEdit.username = e.target.value}
            placeholder={`请输入${props.pageInfo.modelName}名称`}
          />
        </div>
        <div className="input-wrapper">
          <Input
            type="password"
            prefix={<Icon type="key"/>}
            onChange={e => formEdit.password = e.target.value}
            placeholder={`如不需修改${props.pageInfo.modelName}密码可留空`}
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
    </div>
  )
}
