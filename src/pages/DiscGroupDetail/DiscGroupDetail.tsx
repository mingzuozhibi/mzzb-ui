import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Alert, Button, Checkbox, Icon, Input, Modal, PageHeader, Popconfirm, Radio } from 'antd'
import { useData } from '../../hooks/useData'
import { useAjax } from '../../hooks/useAjax'
import { DiscGroup } from '../DiscGroups/DiscGroups'
import { useDocumentTitle } from '../../hooks/hooks'

interface Form {
  key?: string
  title?: string
  enabled?: boolean
  viewType?: string
}

const viewTypes = [
  {label: '日亚实时', value: 'SakuraList'},
  {label: '公开列表', value: 'PublicList'},
  {label: '私有列表', value: 'PrivateList'},
]

interface Props {
  hasAdminRole: boolean
}

export function DiscGroupDetail(props: Props & RouteComponentProps<{ key: string }>) {

  useDocumentTitle('列表信息')

  const {hasAdminRole, match, history} = props

  const [{error, data}, {loading}, {putForm}] = useData<DiscGroup>(`/api/sakuras/key/${match.params.key}`)

  const form: Form = {}

  if (data) {
    form.key = data.key
    form.title = data.title
    form.enabled = data.enabled
    form.viewType = data.viewType
  }

  function submitForm() {
    if (!form.key) {
      Modal.warning({title: '请检查输入项', content: `你必须输入列表索引`})
      return
    }

    if (!form.title) {
      Modal.warning({title: '请检查输入项', content: `你必须输入列表索引`})
      return
    }

    putForm(`/api/sakuras/${data!.id}`, form)
  }

  const {loading: deleting, sendAjax} = useAjax('delete')

  function deleteThis() {
    sendAjax(`/api/sakuras/${data!.id}`, {}, () => {
      Modal.info({title: '删除列表成功'})
    })
  }

  return (
    <div className="DiscGroupDtail">
      {error && (
        <Alert message={error} type="error"/>
      )}
      {data && (
        <>
          <PageHeader title="列表信息" onBack={() => history.goBack()}/>
          <div className="input-wrapper">
            <Input
              prefix={<Icon type="key"/>}
              defaultValue={form.key}
              onChange={e => form.key = e.target.value}
              placeholder={`请输入列表索引`}
            />
          </div>
          <div className="input-wrapper">
            <Input
              prefix={<Icon type="tag-o"/>}
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
            <Checkbox defaultChecked={form.enabled} onChange={e => form.enabled = e.target.checked}>启用</Checkbox>
          </div>
          <div className="input-wrapper">
            <Button type="primary" loading={loading} onClick={submitForm}>提交修改</Button>
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
        </>
      )}
    </div>
  )
}
