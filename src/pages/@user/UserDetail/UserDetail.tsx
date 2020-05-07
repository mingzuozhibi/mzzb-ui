import React from 'react'
import { Input, Modal, Select, Radio } from 'antd'
import { useData } from '../../../hooks/useData'
import { CustomHeader } from '../../../comps/CustomHeader'

import { InputAddonBefore } from '../../../comps/InputAddonBefore'
import { User } from '../../../@version/token'
import request from '../../../@version/request'
import { safeCompare } from '../../../funcs/compare'
import { useRouteMatch } from 'react-router-dom'

export default function UserDetail() {

  const match = useRouteMatch<{ id: string }>()

  const [{ error, data }, { refresh }] = useData<User>(`/api/users/${match.params.id}`)

  function setEnabled(userId: number, enabled: boolean) {
    const body = JSON.stringify({ enabled })
    request(`/api/users/${userId}/enabled`, { body, method: 'put' }).then(json => {
      if (json.success) {
        refresh()
      } else {
        Modal.error({ title: '操作失败', content: json.message })
      }
    })
  }

  function pushRole(userId: number, role: string) {
    const body = JSON.stringify({ targetRole: role })
    request(`/api/users/${userId}/roles`, { body }).then(json => {
      if (json.success) {
        refresh()
      } else {
        Modal.error({ title: '操作失败', content: json.message })
      }
    })
  }

  function dropRole(userId: number, role: string) {
    const body = JSON.stringify({ targetRole: role })
    request(`/api/users/${userId}/roles`, { body, method: 'delete' }).then(json => {
      if (json.success) {
        refresh()
      } else {
        Modal.error({ title: '操作失败', content: json.message })
      }
    })
  }

  const tilte = data ? `用户信息「${data.username}」` : '用户信息「载入中」'

  return (
    <div className="UserDetail">
      <CustomHeader header="用户信息" title={tilte} error={error} />
      {data && (
        <>
          <div className="input-wrapper">
            <Input
              addonBefore="用户名称"
              readOnly={true}
              value={data.username}
            />
          </div>
          <div className="input-wrapper">
            <InputAddonBefore addonBefore="用户权限">
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
                value={sortRoles(data.roles)}
                onSelect={(value) => pushRole(data.id, value)}
                onDeselect={(value) => dropRole(data.id, value)}
              >
                <Select.Option value="RootAdmin">RootAdmin</Select.Option>
                <Select.Option value="UserAdmin">UserAdmin</Select.Option>
                <Select.Option value="DiscAdmin">DiscAdmin</Select.Option>
                <Select.Option value="Login">Login</Select.Option>
              </Select>
            </InputAddonBefore>
          </div>
          <div className="input-wrapper">
            <Input addonBefore="创建日期" value={new Date(data.createOn).toLocaleString()} />
          </div>
          <div className="input-wrapper">
            <Input addonBefore="最后登入" value={new Date(data.loggedOn).toLocaleString()} />
          </div>
          <div className="input-wrapper">
            <InputAddonBefore addonBefore="是否启用" marginRight={10}>
              <Radio.Group value={data.enabled} onChange={(e) => setEnabled(data.id, e.target.value)}>
                <Radio.Button value={true}>启用</Radio.Button>
                <Radio.Button value={false}>禁用</Radio.Button>
              </Radio.Group>
            </InputAddonBefore>
          </div>
        </>
      )}
    </div>
  )
}

const all_roles = ['RootAdmin', 'UserAdmin', 'DiscAdmin', 'Login', 'Guest']
const compare = safeCompare<string, number>({
  apply: t => all_roles.indexOf(t),
  empty: u => u === -1,
  compare: (a, b) => a - b
})

function sortRoles(roles: string[]) {
  const sorted = [...roles]
  sorted.sort(compare)
  return sorted
}
