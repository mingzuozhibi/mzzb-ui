import { MzTopbar } from '#C/topbar/MzTopbar'
import { useAjax } from '#H/useAjax'
import { Button, Card, Form, Input, Radio, Switch } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

import { viewTypes } from '#A/metas'
import { Rules } from '#T/antd'

interface FormCreate {
  key: string
  title: string
  enabled: boolean
  viewType: string
}

const rules: Rules = {
  key: [
    {
      required: true,
      message: '请输入列表索引',
    },
    {
      pattern: /^[A-Za-z0-9\-]{4,50}$/g,
      message: '只能输入英文数字减号，且长度为4-50',
    },
  ],
  title: [
    {
      required: true,
      message: '请输入列表标题',
    },
    {
      min: 4,
      max: 50,
      message: '长度限制为4-50',
    },
  ],
}

export default function DiscGroupAdd() {
  const navigate = useNavigate()
  const location = useLocation()

  const [isPost, doPost] = useAjax('post')

  const onFinish = (form: FormCreate) => {
    doPost('/api/discGroups', '添加列表', {
      body: form,
      onSuccess() {
        setTimeout(() => navigate(-1), 500)
      },
    })
  }

  const initialValues = location.state ?? { enabled: true, viewType: 'PublicList' }

  return (
    <div className="DiscGroupAdd" style={{ maxWidth: 650 }}>
      <MzTopbar title="添加列表" />
      <Card>
        <Form
          style={{ marginTop: 24 }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <Form.Item label="列表索引" name="key" rules={rules.key}>
            <Input />
          </Form.Item>
          <Form.Item label="列表标题" name="title" rules={rules.title}>
            <Input />
          </Form.Item>
          <Form.Item label="列表类型" name="viewType">
            <Radio.Group options={viewTypes} />
          </Form.Item>
          <Form.Item label="是否更新" name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit" loading={isPost}>
              添加列表
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
