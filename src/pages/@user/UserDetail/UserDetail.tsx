import React from 'react'
import { Button, Checkbox, Input, Modal } from 'antd'
import { KeyOutlined, UserOutlined } from '@ant-design/icons'
import { useData } from '../../../hooks/useData'
import { CustomHeader } from '../../../comps/CustomHeader'
import { RouteProps } from '../../@types'

import { User } from '../../../@version/token'
import { encodePasswd } from '../../../@version/passwd'

interface Form {
  username?: string
  password?: string
  enabled?: boolean
}

const form: Form = {}

export default function UserDetail({ match }: RouteProps<{ id: string }>) {

  const [{ error, data }, { loading }, { doEdit }] = useData<User>(`/api/users/${match.params.id}`)

  function submitForm() {
    if (!form.username) {
      Modal.warning({ title: '请检查输入项', content: `你必须输入用户名称` })
      return
    }

    if (form.password) {
      form.password = encodePasswd(form.username, form.password)
    }

    doEdit(`/api/users/${data!.id}`, form)
  }

  if (data) {
    form.username = data.username
    form.enabled = data.enabled
    form.password = ''
  }

  const tilte = data ? `用户信息「${data.username}」` : '载入中'

  return (
    <div className="UserDetail">
      <CustomHeader header="用户信息" title={tilte} error={error} />
      {data && (
        <>
          <div className="input-wrapper">
            <Input
              prefix={<UserOutlined />}
              defaultValue={form.username}
              onChange={e => form.username = e.target.value}
              placeholder={`请输入用户名称`}
            />
          </div>
          <div className="input-wrapper">
            <Input
              type="password"
              prefix={<KeyOutlined />}
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
