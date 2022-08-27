import { MzHeader } from '#C/header/MzHeader'
import { useAjax } from '#H/useAjax'
import { isEmpty } from '#U/domain'
import { KeyOutlined, TagOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input, Modal, Radio } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { viewTypes } from '#A/metas'

interface FormCreate {
  key?: string
  title?: string
  enabled: boolean
  viewType: string
}

export default function DiscGroupAdd() {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormCreate>({
    enabled: true,
    viewType: 'PublicList',
  })
  const [isPost, doPost] = useAjax('post')

  function doCreateGroup() {
    if (isEmpty(form.key)) {
      Modal.warning({ title: '请检查输入项', content: `列表索引必须输入` })
      return
    }

    if (isEmpty(form.title)) {
      Modal.warning({ title: '请检查输入项', content: `列表标题必须输入` })
      return
    }

    doPost('/api/discGroups', '添加列表', {
      body: form,
      onSuccess() {
        setTimeout(() => navigate(-1), 500)
      },
    })
  }

  return (
    <div className="DiscGroupAdd" style={{ maxWidth: 500 }}>
      <MzHeader header="添加列表" />
      <div className="input-wrapper">
        <Input
          prefix={<KeyOutlined />}
          value={form.key}
          onChange={(e) => setForm({ ...form, key: e.target.value.trim() })}
          placeholder={`请输入列表索引`}
        />
      </div>
      <div className="input-wrapper">
        <Input
          prefix={<TagOutlined />}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value.trim() })}
          placeholder={`请输入列表标题`}
        />
      </div>
      <div className="input-wrapper">
        <span className="input-label">列表类型</span>
        <Radio.Group
          options={viewTypes}
          value={form.viewType}
          onChange={(e) => setForm({ ...form, viewType: e.target.value.trim() })}
        />
      </div>
      <div className="input-wrapper">
        <Checkbox
          defaultChecked={form.enabled}
          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
          children="启用"
        />
      </div>
      <div className="input-wrapper">
        <Button type="primary" loading={isPost} onClick={doCreateGroup}>
          提交保存
        </Button>
      </div>
    </div>
  )
}
