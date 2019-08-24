import React from 'react'
import { Button, Input, Modal, PageHeader } from 'antd'
import { Key as KeyIcon, User as UserIcon } from '@ant-design/icons'
import { useAjax } from '../../../hooks/useAjax'
import { md5Password } from '../../../funcs/manager'

interface Form {
  username?: string
  password?: string
}

export default function UserAdd() {

  const [loading, doAdd] = useAjax('post')

  const form: Form = {}

  function saveModel() {
    if (!form.username) {
      Modal.warning({title: '请检查输入项', content: `你必须输入用户名称`})
      return
    }

    if (!form.password) {
      Modal.warning({title: '请检查输入项', content: `你必须输入用户密码`})
      return
    }

    form.password = md5Password(form.username, form.password)

    doAdd('/api/users', '添加用户', {
      body: form, onSuccess() {
        window.history.back()
      }
    })
  }

  return (
    <div className="UserAdd">
      <PageHeader title="添加用户" onBack={() => window.history.back()}/>
      <div className="input-wrapper">
        <Input
          prefix={<UserIcon/>}
          defaultValue={form.username}
          onChange={e => form.username = e.target.value}
          placeholder={`请输入用户名称`}
        />
      </div>
      <div className="input-wrapper">
        <Input
          type="password"
          prefix={<KeyIcon/>}
          defaultValue={form.password}
          onChange={e => form.password = e.target.value}
          placeholder={`请输入用户密码`}
        />
      </div>
      <div className="input-wrapper">
        <Button type="primary" loading={loading} onClick={saveModel}>提交保存</Button>
      </div>
    </div>
  )
}
