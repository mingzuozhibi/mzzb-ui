import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Input, Modal, Select, Radio } from 'antd'
import { useData } from '../../../hooks/useData'
import { InputAddonBefore } from '../../../comps/InputAddonBefore'
import { safeCompare } from '../../../funcs/compare'
import { User } from '../../../reducers/token'
import request from '../../../funcs/request'
import { StateRender } from '../../../comps/StateRender'

export default function UsersId() {

  const params = useParams<{ id: string }>()

  const [state, handler] = useData<User>(`/api/users/${params.id}`)

  const setEnabled = useCallback((userId: number, enabled: boolean) => {
    const body = JSON.stringify({ enabled })
    request(`/api/users/${userId}/enabled`, { body, method: 'put' }).then(json => {
      if (json.success) {
        handler.refresh()
      } else {
        Modal.error({ title: '操作失败', content: json.message })
      }
    })
  }, [handler])

  const pushRole = useCallback((userId: number, role: string) => {
    const body = JSON.stringify({ targetRole: role })
    request(`/api/users/${userId}/roles`, { body }).then(json => {
      if (json.success) {
        handler.refresh()
      } else {
        Modal.error({ title: '操作失败', content: json.message })
      }
    })
  }, [handler])

  const dropRole = useCallback((userId: number, role: string) => {
    const body = JSON.stringify({ targetRole: role })
    request(`/api/users/${userId}/roles`, { body, method: 'delete' }).then(json => {
      if (json.success) {
        handler.refresh()
      } else {
        Modal.error({ title: '操作失败', content: json.message })
      }
    })
  }, [handler])

  const render = useCallback((data: User) => (
    <div className="UsersIdForm">
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
    </div>
  ), [setEnabled, pushRole, dropRole])

  return (
    <StateRender
      title={'用户信息'}
      className="UsersId"
      state={state}
      render={render}
      handler={handler}
    />
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
