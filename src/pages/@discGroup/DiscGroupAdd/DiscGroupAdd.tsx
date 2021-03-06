import React from 'react'
import { Button, Input, Modal } from 'antd'
import { KeyOutlined, TagOutlined } from '@ant-design/icons'
import { useAjax } from '../../../hooks/useAjax'
import { CustomHeader } from '../../../comps/CustomHeader'

interface Form {
  key?: string
  title?: string
  enabled?: boolean
  viewType?: string
}

export default function DiscGroupAdd() {

  const [loading, doAdd] = useAjax('post')

  const form: Form = {
    enabled: true,
    viewType: 'PublicList',
  }

  function addList() {
    if (!form.key) {
      Modal.warning({ title: '请检查输入项', content: `列表索引必须输入` })
      return
    }

    if (!form.title) {
      Modal.warning({ title: '请检查输入项', content: `列表标题必须输入` })
      return
    }

    doAdd('/api/discGroups', '添加列表', {
      body: form, onSuccess() {
        setTimeout(() => window.history.back(), 500)
      }
    })
  }

  return (
    <div className="admin-sakura-save-content">
      <CustomHeader header="添加列表" />
      <div className="input-wrapper">
        <Input
          prefix={<KeyOutlined />}
          defaultValue={form.key}
          onChange={(e) => form.key = e.target.value}
          placeholder={`请输入列表索引`}
        />
      </div>
      <div className="input-wrapper">
        <Input
          prefix={<TagOutlined />}
          defaultValue={form.title}
          onChange={(e) => form.title = e.target.value}
          placeholder={`请输入列表标题`}
        />
      </div>
      {/* <div className="input-wrapper">
        <span className="input-label">列表类型</span>
        <Radio.Group
          options={viewTypes}
          defaultValue={form.viewType}
          onChange={e => form.viewType = e.target.value}
        />
      </div> */}
      {/* <div className="input-wrapper">
        <Checkbox
          defaultChecked={form.enabled}
          onChange={e => form.enabled = e.target.checked}
          children="启用"
        />
      </div> */}
      <div className="input-wrapper">
        <Button type="primary" loading={loading} onClick={addList}>提交保存</Button>
      </div>
    </div>
  )
}
