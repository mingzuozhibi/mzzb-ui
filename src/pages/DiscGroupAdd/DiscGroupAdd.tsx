import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Icon, Input, message, Modal, Radio } from 'antd'
import { useAjax } from '../../hooks/useAjax'
import { viewTypes } from '../DiscGroups/DiscGroups'

interface Form {
  key?: string
  title?: string
  viewType?: string
}

export default function DiscGroupAdd({history}: RouteComponentProps<void>) {

  const {loading, sendAjax} = useAjax('post')

  const form: Form = {}

  function saveModel() {
    if (!form.key) {
      Modal.warning({title: '请检查输入项', content: `列表索引必须输入`})
      return
    }

    if (!form.title) {
      Modal.warning({title: '请检查输入项', content: `列表标题必须输入`})
      return
    }

    if (!form.viewType) {
      Modal.warning({title: '请检查输入项', content: '你必须选择一个列表类型'})
      return
    }

    sendAjax('/api/sakuras', form, () => {
      message.success('添加列表成功')
      history.push('/disc_groups')
    })
  }

  return (
    <div className="admin-sakura-save-content">
      <div className="input-wrapper">
        <Input
          prefix={<Icon type="key"/>}
          defaultValue={form.key}
          onChange={(e) => form.key = e.target.value}
          placeholder={`请输入列表索引`}
        />
      </div>
      <div className="input-wrapper">
        <Input
          prefix={<Icon type="tag-o"/>}
          defaultValue={form.title}
          onChange={(e) => form.title = e.target.value}
          placeholder={`请输入列表标题`}
        />
      </div>
      <div className="input-wrapper">
        <span className="input-label">列表类型</span>
        <Radio.Group
          options={viewTypes}
          defaultValue={form.viewType}
          onChange={e => form.viewType = e.target.value}
        />
      </div>
      <div className="input-wrapper">
        <Button type="primary" loading={loading} onClick={saveModel}>提交保存</Button>
      </div>
    </div>
  )
}
