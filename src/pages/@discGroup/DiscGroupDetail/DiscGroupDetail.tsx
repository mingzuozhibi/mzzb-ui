import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Checkbox, Input, Modal, Popconfirm, Radio } from 'antd'
import { Key as KeyIcon, Tag as TagIcon } from '@ant-design/icons'

import { useData } from '../../../hooks/useData'
import { useAjax } from '../../../hooks/useAjax'
import { DiscGroup, viewTypes } from '../discGroup'
import { CustomHeader } from '../../../comps/CustomHeader'

interface Form {
  key?: string
  title?: string
  enabled?: boolean
  viewType?: string
}

interface Props {
  hasAdminRole: boolean
}

export function DiscGroupDetail(props: Props & RouteComponentProps<{ key: string }>) {

  const {hasAdminRole, match} = props

  const [{error, data}, {loading}, {doEdit}] =
    useData<DiscGroup>(`/api/discGroups/key/${match.params.key}`)

  const form: Form = {}

  if (data) {
    form.key = data.key
    form.title = data.title
    form.enabled = data.enabled
    form.viewType = data.viewType
  }

  function editData() {
    if (!form.key) {
      Modal.warning({title: '请检查输入项', content: `你必须输入列表索引`})
      return
    }

    if (!form.title) {
      Modal.warning({title: '请检查输入项', content: `你必须输入列表索引`})
      return
    }

    doEdit(`/api/discGroups/${data!.id}`, form)
  }

  const [deleting, doDelete] = useAjax('delete')
  const [deleted, setDeleted] = useState(false)

  function deleteThis() {
    doDelete(`/api/discGroups/${data!.id}`, '删除列表', {
      onSuccess() {
        setDeleted(true)
      }
    })
  }

  const title = data ? `列表信息：${data.title}` : '载入中'

  return (
    <div className="DiscGroupDtail">
      <CustomHeader header="列表信息" title={title} error={error}/>
      {data && (
        <>
          <div className="input-wrapper">
            <Input
              prefix={<KeyIcon/>}
              defaultValue={form.key}
              onChange={e => form.key = e.target.value}
              placeholder={`请输入列表索引`}
            />
          </div>
          <div className="input-wrapper">
            <Input
              prefix={<TagIcon/>}
              defaultValue={form.title}
              onChange={e => form.title = e.target.value}
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
            <Checkbox
              defaultChecked={form.enabled}
              onChange={e => form.enabled = e.target.checked}
              children="启用"
            />
          </div>
          {deleted ? (
            <div className="input-wrapper">
              <Button type="primary" onClick={() => window.history.back()}>点击返回</Button>
            </div>
          ) : (
            <div className="input-wrapper">
              <Button type="primary" loading={loading} onClick={editData}>提交修改</Button>
              {hasAdminRole && (
                <Popconfirm
                  title="你确定要删除这个列表吗？"
                  placement="bottomRight"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={deleteThis}
                >
                  <Button type="danger" loading={deleting} style={{marginLeft: 20}}>删除列表</Button>
                </Popconfirm>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
