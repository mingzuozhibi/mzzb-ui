import { SubmitItem } from '#CC/form/SubmitItem'
import { MzHeader } from '#CC/header/MzHeader'
import { useAjax } from '#CH/useAjax'
import { useData } from '#CH/useOnce'
import { safeWarpper } from '#CU/empty'
import { Button, Card, Form, Input, Switch } from 'antd'
import { useParams } from 'react-router-dom'

import { Rules } from '#DT/antd'
import { IUser } from '#DT/user'
import { encodePassword } from '#DU/user-utils'
import { apiToUsers } from '#RU/links'

interface FormEdit {
  username: string
  password: string | undefined
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
      min: 6,
      message: '用户密码不得短于6位',
    },
  ],
}

export default function UserDetail() {
  const params = useParams<{ id: string }>()
  const userId = params.id as string

  const apiUrl = apiToUsers(`/${userId}`)
  const { data: user, ...state } = useData<IUser>(apiUrl)

  const [isEdit, doEdit] = useAjax<IUser>('put')
  function onFinish(form: FormEdit) {
    const { username, password, enabled } = form
    const encode = safeWarpper(password, (password) => {
      return encodePassword(username, password)
    })
    doEdit(apiToUsers(`/${userId}`), '编辑用户', {
      body: { username, password: encode, enabled },
      onSuccess: state.mutate,
    })
  }

  return (
    <div className="UserDetail" style={{ maxWidth: 650 }}>
      <MzHeader title={{ prefix: '用户信息', suffix: user?.username }} state={state} />
      {safeWarpper(user, (user) => (
        <Card>
          <Form
            style={{ marginTop: 24 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            initialValues={user}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item label="用户名称" name="username" rules={rules.username}>
              <Input />
            </Form.Item>
            <Form.Item label="用户密码" name="password" rules={rules.password}>
              <Input.Password placeholder="如不需修改用户密码可留空" />
            </Form.Item>
            <Form.Item label="是否启用" name="enabled" valuePropName="checked">
              <Switch />
            </Form.Item>
            <SubmitItem span={[6, 12]}>
              <Button type="primary" htmlType="submit" loading={isEdit}>
                提交更新
              </Button>
            </SubmitItem>
          </Form>
        </Card>
      ))}
    </div>
  )
}
