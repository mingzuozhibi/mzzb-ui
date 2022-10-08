import { SubmitItem } from '#CC/form/SubmitItem'
import { MzHeader } from '#CC/header/MzHeader'
import { useAjax } from '#CH/useAjax'
import { Button, Card, Form, Input, Radio, Switch } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

import { Rules } from '#DT/antd'
import { viewTypes } from '#DT/metas'
import { apiToGroups, linkToGroups } from '#RU/links'

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
    doPost(apiToGroups(), '添加列表', {
      body: form,
      onSuccess() {
        setTimeout(() => navigate(-1), 500)
      },
    })
  }

  const initialValues = location.state ?? { enabled: true, viewType: 'PublicList' }

  return (
    <div className="DiscGroupAdd" style={{ maxWidth: 650 }}>
      <MzHeader title="添加列表" />
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
          {location.state ? (
            <SubmitItem>
              <Button type="primary" htmlType="submit" loading={isPost}>
                重新添加
              </Button>
              <Button onClick={() => navigate(linkToGroups())}>点击返回</Button>
            </SubmitItem>
          ) : (
            <SubmitItem>
              <Button type="primary" htmlType="submit" loading={isPost}>
                添加列表
              </Button>
            </SubmitItem>
          )}
        </Form>
      </Card>
    </div>
  )
}
