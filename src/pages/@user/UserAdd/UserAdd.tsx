import { MzHeader } from '#C/header/MzHeader'
import { useAjax } from '#H/useAjax'
import { useForm } from '#H/useFrom'
import { KeyOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'

import { IUser } from '#T/user'
import { encodePassword } from '#U/domain'

interface FormCreate {
  username?: string
  password?: string
  enabled?: boolean
}

export default function UserAdd() {
  const navigate = useNavigate()

  const { form, onValueChange, onCheckChange } = useForm<FormCreate>({
    enabled: true,
  })
  const [isPost, doPost] = useAjax<IUser>('post')

  function doCreateUser() {
    if (!form.username) {
      Modal.warning({ title: '请检查输入项', content: `你必须输入用户名称` })
      return
    }

    if (!form.password) {
      Modal.warning({ title: '请检查输入项', content: `你必须输入用户密码` })
      return
    }

    const body = { ...form, password: encodePassword(form.username, form.password) }

    doPost('/api/users', '添加用户', {
      body,
      onSuccess() {
        setTimeout(() => navigate(-1), 500)
      },
    })
  }

  return (
    <div className="UserAdd" style={{ maxWidth: 500 }}>
      <MzHeader header="添加用户" />
      <div className="input-wrapper">
        <Input
          prefix={<UserOutlined />}
          defaultValue={form.username}
          onChange={onValueChange('username')}
          placeholder="请输入用户名称"
        />
      </div>
      <div className="input-wrapper">
        <Input
          type="password"
          prefix={<KeyOutlined />}
          defaultValue={form.password}
          onChange={onValueChange('password')}
          placeholder="请输入用户密码"
        />
      </div>
      <div className="input-wrapper">
        <Checkbox
          defaultChecked={form.enabled}
          onChange={onCheckChange('enabled')}
          children="启用"
        />
      </div>
      <div className="input-wrapper">
        <Button type="primary" loading={isPost} onClick={doCreateUser}>
          提交保存
        </Button>
      </div>
    </div>
  )
}
