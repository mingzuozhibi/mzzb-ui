import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Icon, Input, message, Modal, PageHeader } from 'antd'
import { usePost } from '../../hooks/usePost'
import { md5Password } from '../../funcs/manager'

interface Form {
  username?: string
  password?: string
}

export default function UserAdd({history}: RouteComponentProps<void>) {

  const {loading, postForm} = usePost()

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

    postForm(`/api/users`, form, () => {
      message.success('添加用户成功')
      history.push('/users')
    })
  }

  return (
    <div className="UserAdd">
      <PageHeader title="添加用户" onBack={() => history.push(`/users`)}/>
      <div className="input-wrapper">
        <Input
          prefix={<Icon type="user"/>}
          defaultValue={form.username}
          onChange={e => form.username = e.target.value}
          placeholder={`请输入用户名称`}
        />
      </div>
      <div className="input-wrapper">
        <Input
          type="password"
          prefix={<Icon type="key"/>}
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
