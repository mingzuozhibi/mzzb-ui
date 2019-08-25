import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Alert, Button, Checkbox, Input, Modal, PageHeader } from 'antd'
import { Key as KeyIcon, User as UserIcon } from '@ant-design/icons'
import { useData } from '../../../hooks/useData'
import { md5Password } from '../../../funcs/manager'
import { User } from '../user'

interface Form {
  username?: string
  password?: string
  enabled?: boolean
}

const form: Form = {}

export default function UserDetail({match}: RouteComponentProps<{ id: string }>) {

  const [{error, data}, {loading}, {doEdit}] = useData<User>(`/api/users/${match.params.id}`)

  function submitForm() {
    if (!form.username) {
      Modal.warning({title: '请检查输入项', content: `你必须输入用户名称`})
      return
    }

    if (form.password) {
      form.password = md5Password(form.username, form.password)
    }

    doEdit(`/api/users/${data!.id}`, form)
  }

  if (data) {
    form.username = data.username
    form.enabled = data.enabled
    form.password = ''
  }

  return (
    <div className="UserDetail">
      <PageHeader title="用户信息" onBack={() => window.history.back()}/>
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <>
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
              onChange={e => form.password = e.target.value}
              placeholder={`如不需修改用户密码可留空`}
            />
          </div>
          <div className="input-wrapper">
            <Checkbox
              defaultChecked={form.enabled}
              onChange={e => form.enabled = e.target.checked}
            >
              启用
            </Checkbox>
          </div>
          <div className="input-wrapper">
            <Button type="primary" loading={loading} onClick={submitForm}>提交修改</Button>
          </div>
        </>
      )}
    </div>
  )
}