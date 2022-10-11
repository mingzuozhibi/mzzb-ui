import { SubmitItem } from '#CC/form/SubmitItem'
import { MzHeader } from '#CC/header/MzHeader'
import { useAjax } from '#CH/useAjax'
import { Button, Card, Form, Input, Switch } from 'antd'
import { useNavigate } from 'react-router-dom'

import { Rules } from '#DT/antd'
import { IUser } from '#DT/user'
import { encodePassword } from '#DU/user-utils'
import { apiToUsers } from '#RU/links'

interface FormCreate {
  username: string
  password: string
  enabled: boolean
}

const rules: Rules = {
  username: [
    {
      required: true,
      message: '请输入用户名称',
    },
    {
      pattern: /^[A-Za-z0-9_]{4,20}$/g,
      message: '只能输入英文数字下划线，且长度为4-20',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入用户密码',
    },
    {
      min: 6,
      message: '用户密码不得短于6位',
    },
  ],
}

export default function UserAdd() {
  const navigate = useNavigate()

  const [isPost, doPost] = useAjax<IUser>('post')

  function onFinish(form: FormCreate) {
    const { username, password, enabled } = form
    const encode = encodePassword(username, password)
    doPost(apiToUsers(), '添加用户', {
      body: { username, password: encode, enabled },
      onSuccess() {
        setTimeout(() => navigate(-1), 500)
      },
    })
  }

  return (
    <div className="UserAdd" style={{ maxWidth: 650 }}>
      <MzHeader title="添加用户" />
      <Card>
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
          <Form.Item label="是否启用" name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <SubmitItem span={[6, 12]}>
            <Button type="primary" htmlType="submit" loading={isPost}>
              添加用户
            </Button>
          </SubmitItem>
        </Form>
      </Card>
    </div>
  )
}
