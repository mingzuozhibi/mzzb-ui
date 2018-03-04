import * as React from 'react'
import { Button, Input, Modal } from 'antd'
import { md5Password } from '../../utils/manager'
import { PageInfo } from '../../common/route-infos'
import { Icon } from '../../lib/icon'

interface FormSave {
  username?: string
  password?: string
}

const formSave: FormSave = {}

interface Props {
  pageInfo: PageInfo
  saveModel: (model: {}) => void
}

export function AdminUserSave(props: Props) {

  function saveModel() {
    const username = formSave.username
    const password = formSave.password

    if (!username) {
      Modal.warning({title: '请检查输入项', content: `你必须输入${props.pageInfo.modelName}名称`})
      return
    }

    if (!password) {
      Modal.warning({title: '请检查输入项', content: `你必须输入${props.pageInfo.modelName}密码`})
      return
    }

    const encode = md5Password(username, password)
    props.saveModel({username, password: encode})
  }

  return (
    <div className="admin-users-save-content">
      <div className="input-wrapper">
        <Input
          prefix={<Icon type="user"/>}
          defaultValue={formSave.username}
          onChange={e => formSave.username = e.target.value}
          placeholder={`请输入${props.pageInfo.modelName}名称`}
        />
      </div>
      <div className="input-wrapper">
        <Input
          type="password"
          prefix={<Icon type="key"/>}
          defaultValue={formSave.password}
          onChange={e => formSave.password = e.target.value}
          placeholder={`请输入${props.pageInfo.modelName}密码`}
        />
      </div>
      <div className="input-wrapper">
        <Button type="primary" onClick={saveModel}>添加{props.pageInfo.modelName}</Button>
      </div>
    </div>
  )
}
