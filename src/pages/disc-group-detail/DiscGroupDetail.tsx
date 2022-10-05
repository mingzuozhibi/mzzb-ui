import { useAppSelector } from '#A/hooks'
import { MzHeader } from '#C/header/MzHeader'
import { useAjax } from '#H/useAjax'
import { useData } from '#H/useOnce'
import { safeWarpper } from '#U/domain'
import { Button, Card, Form, Input, Popconfirm, Radio, Space, Switch } from 'antd'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { apiToGroups } from '#A/links'
import { viewTypes } from '#A/metas'
import { Rules } from '#T/antd'
import { IGroup } from '#T/disc'

interface FormEdit {
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

export default function DiscGroupDetail() {
  const params = useParams<{ key: string }>()
  const groupKey = params.key as string

  const [isEdit, doEdit] = useAjax<IGroup>('put')
  const [isDrop, doDrop] = useAjax<IGroup>('delete')
  const [deleted, setDeleted] = useState<IGroup>()

  const apiUrl = apiToGroups(`/key/${groupKey}`)
  const { data: group, ...state } = useData<IGroup>(apiUrl)

  function onFinish(form: FormEdit) {
    doEdit(apiToGroups(`/${group?.id}`), '编辑列表', {
      body: form,
      onSuccess: state.mutate,
    })
  }

  function doDeleteGroup() {
    doDrop(apiToGroups(`/${group?.id}`), '删除列表', {
      onSuccess: setDeleted,
    })
  }

  const hasAdmin = useAppSelector((state) => state.session.hasAdmin)

  return (
    <div className="DiscGroupDetail" style={{ maxWidth: 650 }}>
      <MzHeader title={{ prefix: '列表信息', suffix: group?.title }} state={state} />
      {safeWarpper(group, (group) => (
        <Card>
          <Form
            style={{ marginTop: 24 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            initialValues={group}
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
              {deleted ? (
                <Navigate to="/disc_groups/add" state={deleted} />
              ) : (
                <Space size="large">
                  <Button type="primary" htmlType="submit" loading={isEdit}>
                    提交更新
                  </Button>
                  {hasAdmin && (
                    <Popconfirm
                      title="你确定要删除这个列表吗？"
                      placement="bottomRight"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={doDeleteGroup}
                    >
                      <Button danger={true} loading={isDrop}>
                        删除列表
                      </Button>
                    </Popconfirm>
                  )}
                </Space>
              )}
            </Form.Item>
          </Form>
        </Card>
      ))}
    </div>
  )
}
