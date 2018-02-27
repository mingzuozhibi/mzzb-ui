import * as React from 'react'
import { Alert, Button, Checkbox, Input, Modal, Tabs } from 'antd'
import { Column, Table } from '../../lib/table'
import { Link } from '../../lib/link'
import { Icon } from '../../lib/icon'
import { Helmet } from 'react-helmet'

import { md5Password } from '../../utils/manager'
import { ViewportProps } from '../../hoc/Viewport'
import { AdminUserModel, AdminUserState } from './reducer'
import { PageInfo } from '../../common/root-reducer'

interface FormSave {
  username?: string
  password?: string
}

interface FormEdit {
  username?: string
  password?: string
  enabled?: boolean
}

const formSave: FormSave = {}
const formEdit: FormEdit = {}

export type OwnProps = ViewportProps

interface AdminUserProps extends AdminUserState, OwnProps {
  pageInfo: PageInfo
  saveModel: (model: {}) => void
  editModel: (model: {}) => void
}

export function AdminUser(props: AdminUserProps) {

  function getColumns(): Column<AdminUserModel>[] {
    return [
      {
        key: 'id',
        title: 'ID',
        format: (t) => t.id
      },
      {
        key: 'username',
        title: `${props.pageInfo.modelName}名`,
        format: (t) => t.username
      },
      {
        key: 'enabled',
        title: '启用',
        format: (t) => t.enabled ? '是' : '否'
      },
      {
        key: 'registerDate',
        title: '注册时间',
        format: (t) => formatRegisterDate(t)
      },
      {
        key: 'lastLoggedIn',
        title: '最后登入',
        format: (t) => formatLastLoggedIn(t)
      },
      {
        key: 'control',
        title: '功能',
        format: (t) => <Link onClick={() => showEditModal(t)}>编辑</Link>
      }
    ]
  }

  function formatRegisterDate(t: AdminUserModel) {
    return formatLong(t.registerDate, 0, 10)
  }

  function formatLastLoggedIn(t: AdminUserModel) {
    const text = t.lastLoggedIn
    return text ? formatLong(text, 5, 11) : '从未登入'
  }

  function formatLong(text: string, start: number, length: number) {
    return props.viewport!.width <= 600 ? text.substr(start, length) : text
  }

  function saveModel() {
    const username = formSave.username
    const password = formSave.password

    if (!username) {
      Modal.warning({title: '请检查输入项', content: `你必须输入${props.pageInfo.modelName}名称`})
      return
    }

    if (!password) {
      Modal.warning({title: '请检查输入项', content: `你必须输入${props.pageInfo.modelName}密码`})
      return
    }

    const encode = md5Password(username, password)
    props.saveModel({username, password: encode})
  }

  function editModel(id: number) {
    const username = formEdit.username
    const password = formEdit.password
    const enabled = formEdit.enabled

    if (!username) {
      Modal.warning({title: '请检查输入项', content: `你必须输入${props.pageInfo.modelName}名称`})
      return
    }

    const encode = password ? md5Password(username, password) : ''
    props.editModel({id, username, password: encode, enabled})
  }

  return (
    <div className="admin-users">
      <Helmet>
        <title>{props.pageInfo.pageTitle} - 名作之壁吧</title>
      </Helmet>
      <Tabs>
        <Tabs.TabPane tab={`${props.pageInfo.modelName}列表`} key="1">
          {props.message && (
            <Alert message={props.message} type="error"/>
          )}
          {props.models && (
            <Table rows={props.models} columns={getColumns()}/>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab={`添加${props.pageInfo.modelName}`} key="2">
          <div className="input-wrapper">
            <Input
              prefix={<Icon type="user"/>}
              defaultValue={formSave.username}
              onChange={e => formSave.username = e.target.value}
              placeholder={`请输入${props.pageInfo.modelName}名称`}
            />
          </div>
          <div className="input-wrapper">
            <Input
              type="password"
              prefix={<Icon type="key"/>}
              defaultValue={formSave.password}
              onChange={e => formSave.password = e.target.value}
              placeholder={`请输入${props.pageInfo.modelName}密码`}
            />
          </div>
          <div className="input-wrapper">
            <Button type="primary" onClick={saveModel}>添加{props.pageInfo.modelName}</Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )

  function showEditModal(model: AdminUserModel) {
    formEdit.username = model.username
    formEdit.enabled = model.enabled
    formEdit.password = undefined

    Modal.confirm({
      title: `编辑${props.pageInfo.modelName}`,
      okText: '保存',
      okType: 'primary',
      onOk: () => editModel(model.id),
      cancelText: '取消',
      content: (
        <div>
          <div className="input-wrapper">
            <Input
              prefix={<Icon type="user"/>}
              defaultValue={formEdit.username}
              onChange={e => formEdit.username = e.target.value}
              placeholder={`请输入${props.pageInfo.modelName}名称`}
            />
          </div>
          <div className="input-wrapper">
            <Input
              type="password"
              prefix={<Icon type="key"/>}
              onChange={e => formEdit.password = e.target.value}
              placeholder={`如不需修改${props.pageInfo.modelName}密码可留空`}
            />
          </div>
          <div className="input-wrapper">
            <Checkbox
              defaultChecked={formEdit.enabled}
              onChange={e => formEdit.enabled = e.target.checked}
            >
              启用
            </Checkbox>
          </div>
        </div>
      ),
    })
  }
}
