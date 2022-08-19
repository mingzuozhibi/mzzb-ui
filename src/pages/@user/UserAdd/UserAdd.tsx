import { MzHeader } from '##/comps/header/MzHeader'
import { useAjax, useForm } from '##/hooks'
import { md5Password } from '#U/manager'
import { User } from '#P/@types'
import { KeyOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input, Modal } from 'antd'
import { useHistory } from 'react-router-dom'

interface FormCreate {
  username?: string
  password?: string
  enabled?: boolean
}

export default function UserAdd() {
  const history = useHistory()
  const { form, onChange, onSelect } = useForm<FormCreate>({
    enabled: true,
  })
  const [inPost, doPost] = useAjax<User>('post')

  function submitCreate() {
    if (!form.username) {
      Modal.warning({ title: '请检查输入项', content: `你必须输入用户名称` })
      return
    }

    if (!form.password) {
      Modal.warning({ title: '请检查输入项', content: `你必须输入用户密码` })
      return
    }

    const body = { ...form, password: md5Password(form.username, form.password) }

    doPost('/api/users', '添加用户', {
      body,
      onSuccess() {
        setTimeout(() => history.goBack(), 500)
      },
    })
  }

  return (
    <div className="UserAdd">
      <MzHeader header="添加用户" />
      <div className="input-wrapper">
        <Input
          prefix={<UserOutlined />}
          defaultValue={form.username}
          onChange={onChange((drfat, value) => {
            drfat.username = value
          })}
          placeholder="请输入用户名称"
        />
      </div>
      <div className="input-wrapper">
        <Input
          type="password"
          prefix={<KeyOutlined />}
          defaultValue={form.password}
          onChange={onChange((drfat, value) => {
            drfat.password = value
          })}
          placeholder="请输入用户密码"
        />
      </div>
      <div className="input-wrapper">
        <Checkbox
          defaultChecked={form.enabled}
          onChange={onSelect((drfat, checked) => {
            drfat.enabled = checked
          })}
          children="启用"
        />
      </div>
      <div className="input-wrapper">
        <Button type="primary" loading={inPost} onClick={submitCreate}>
          提交保存
        </Button>
      </div>
    </div>
  )
}
