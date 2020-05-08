import React, { useState } from 'react'
import { Button, Input, Modal, Popconfirm, Radio } from 'antd'
import { useData } from '../../../hooks/useData'
import { useAjax } from '../../../hooks/useAjax'
import { CustomHeader } from '../../../comps/CustomHeader'
import { Group, RouteProps } from '../../@types'
import { useTokenSelector } from '../../../reducers/token'

interface Form {
  index?: string
  title?: string
  status?: string
  update?: string
  updateDate?: string
}

export default DiscGroupDetail

function DiscGroupDetail(props: RouteProps<{ index: string }>) {

  const { match } = props

  const isDiscAdmin = useTokenSelector(state => state.roles.isDiscAdmin)

  const [{ error, data }, { loading }] = useData<Group>(`/api/groups/find/index/${match.params.index}`)

  const form: Form = {}

  if (data) {
    form.index = data.index
    form.title = data.title
    form.status = data.status
    form.update = data.update
    form.updateDate = data.updateDate
  }

  function editData() {
    if (!form.index) {
      Modal.warning({ title: '请检查输入项', content: `你必须输入列表索引` })
      return
    }

    if (!form.title) {
      Modal.warning({ title: '请检查输入项', content: `你必须输入列表索引` })
      return
    }

    // doEdit(`/api/discGroups/${data!.id}`, form)
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
      <CustomHeader header="列表信息" title={title} error={error} />
      {data && (
        <>
          <div className="input-wrapper">
            <Input
              addonBefore="列表索引"
              defaultValue={form.index}
              onChange={e => form.index = e.target.value}
              placeholder={`请输入列表索引`}
            />
          </div>
          <div className="input-wrapper">
            <Input
              addonBefore="列表标题"
              defaultValue={form.title}
              onChange={e => form.title = e.target.value}
              placeholder={`请输入列表标题`}
            />
          </div>
          <div className="input-wrapper">
            <span className="input-label">列表类型</span>
            <Radio.Group defaultValue={form.status} onChange={e => form.status = e.target.value}>
              <Radio value="Current">当前</Radio>
              <Radio value="History">历史</Radio>
              <Radio value="Private">私有</Radio>
            </Radio.Group>
          </div>
          <div className="input-wrapper">
            <span className="input-label">更新类型</span>
            <Radio.Group defaultValue={form.update} onChange={e => form.update = e.target.value}>
              <Radio value="Always">总是</Radio>
              <Radio value="Never">从不</Radio>
              <Radio value="Utils">直到更新日前</Radio>
            </Radio.Group>
          </div>
          <div className="input-wrapper">
            <Input
              addonBefore="更新日期"
              defaultValue={form.updateDate}
              onChange={e => form.updateDate = e.target.value}
              placeholder={`请输入更新日期`}
            />
          </div>
          {deleted ? (
            <div className="input-wrapper">
              <Button type="primary" onClick={() => window.history.back()}>点击返回</Button>
            </div>
          ) : (
              <div className="input-wrapper">
                <Button type="primary" loading={loading} onClick={editData}>提交修改</Button>
                {isDiscAdmin && (
                  <Popconfirm
                    title="你确定要删除这个列表吗？"
                    placement="bottomRight"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={deleteThis}
                  >
                    <Button danger={true} loading={deleting} style={{ marginLeft: 20 }}>删除列表</Button>
                  </Popconfirm>
                )}
              </div>
            )}
        </>
      )}
    </div>
  )
}
