import { useAppDispatch, useAppSelector } from '#A/hooks'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Input, Space } from 'antd'

import { setViewLogin } from '#F/layout'
import { sessionLogin } from '#F/session'
import { Rules } from '#T/antd'
import { encodePassword } from '#U/format'

interface FormLogin {
  username: string
  password: string
}

const rules: Rules = {
  username: [
    {
      required: true,
      message: '请输入用户名称',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入用户密码',
    },
  ],
}

export function AppLogin() {
  const submiting = useAppSelector((state) => state.layout.submiting)
  const viewLogin = useAppSelector((state) => state.layout.viewLogin)

  const dispatch = useAppDispatch()
  const onFinish = (form: FormLogin) => {
    const { username, password } = form
    const encode = encodePassword(username, password)
    dispatch(sessionLogin({ username, password: encode }))
  }
  const onCancel = () => {
    dispatch(setViewLogin(false))
  }

  return (
    <Drawer
      className="app-login"
      title="用户登入"
      placement="top"
      onClose={onCancel}
      open={viewLogin}
      closable={false}
      extra={<CloseOutlined onClick={onCancel} />}
    >
      <Form
        style={{ marginTop: 24 }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ enabled: true }}
        onFinish={onFinish}
      >
        <Form.Item label="用户名称" name="username" rules={rules.username}>
          <Input />
        </Form.Item>
        <Form.Item label="用户密码" name="password" rules={rules.password}>
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Space size="large">
            <Button type="primary" htmlType="submit" loading={submiting}>
              登入
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
