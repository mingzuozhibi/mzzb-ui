import * as React from 'react'
import { Alert, Button, Checkbox, Input, Modal, Tabs } from 'antd'
import Table, { Column } from '../../lib/table'
import Icon from '../../lib/icon'
import Link from '../../lib/link'
import './admin-user.css'

import { Manager, md5Password, Model, Result } from '../../utils/manager'
import { AppState, default as App } from '../../App'
import produce from 'immer'

const formatLong = (text: string, start: number, length: number, short: boolean) => {
  return short ? text.substr(start, length) : text
}

const getColumns = (isMobile: boolean): Column<AdminUserModel>[] => [
  {
    key: 'id',
    title: '#',
    format: (t) => t.id
  },
  {
    key: 'username',
    title: '用户名',
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
    format: (t) => formatLong(t.registerDate, 0, 10, isMobile)
  },
  {
    key: 'lastLoggedIn',
    title: '最后登入',
    format: (t) => formatLong(t.lastLoggedIn, 5, 11, isMobile)
  },
]

interface AdminUserModel extends Model {
  username: string
  enabled: boolean
  registerDate: string
  lastLoggedIn: string
}

interface AdminUserState {
  users?: AdminUserModel[]
  message?: string
}

export class AdminUser extends React.Component<{}, AdminUserState> {

  static contextTypes = App.childContextTypes

  manager: Manager<AdminUserModel> = new Manager('/api/admin/users')

  constructor(props: {}) {
    super(props)

    this.state = {}
  }

  update = (reducer: (draft: AdminUserState) => void) => {
    this.setState((prevState => produce(prevState, reducer)))
  }

  listUser = async () => {
    this.context.update((draft: AppState) => {
      draft.reload!.pending = true
    })

    const result: Result<AdminUserModel[]> = await this.manager.findAll()

    this.update(draft => {
      if (result.success) {
        draft.users = result.data
        draft.message = undefined
      } else {
        draft.message = result.message
      }
    })

    this.context.update((draft: AppState) => {
      draft.reload!.pending = false
    })
  }

  saveUser = async () => {
    const username = (document.querySelector('#save-username') as HTMLInputElement).value
    const password = (document.querySelector('#save-password') as HTMLInputElement).value

    if (!username || !password) {
      Modal.warning({title: '请检查输入项', content: '你必须输入用户名和密码'})
    } else {
      const encode = md5Password(username, password)
      const result = await this.manager.addOne({username, password: encode})

      if (result.success) {
        this.update(draft => {
          draft.users!.push(result.data)
        })
      } else {
        Modal.error({title: '添加用户错误', content: result.message})
      }
    }
  }

  editUser = async (id: number) => {
    const username = (document.querySelector('#edit-username') as HTMLInputElement).value
    const password = (document.querySelector('#edit-password') as HTMLInputElement).value
    const enabled = (document.querySelector('#edit-enabled input') as HTMLInputElement).checked

    if (!username) {
      Modal.warning({title: '请检查输入项', content: '你必须输入用户名'})
    } else {
      const encode = password ? md5Password(username, password) : ''
      const result = await this.manager.update({
        id, username, password: encode, enabled
      })

      if (result.success) {
        this.update(draft => {
          draft.users = draft.users!.map(u => u.id === result.data.id ? result.data : u)
        })
      } else {
        Modal.error({title: '编辑用户错误', content: result.message})
      }
    }
  }

  async componentDidMount() {
    this.context.update((draft: AppState) => {
      draft.reload = {pending: true, handle: this.listUser}
    })

    await this.listUser()
  }

  showEditConfirm(user: AdminUserModel) {
    Modal.confirm({
      title: '编辑用户',
      okText: '保存',
      okType: 'primary',
      onOk: () => this.editUser(user.id),
      cancelText: '取消',
      content: (
        <div>
          <div style={{padding: 10}}>
            <Input
              id="edit-username"
              defaultValue={user.username}
              prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
              placeholder="请输入用户名"
            />
          </div>
          <div style={{padding: 10}}>
            <Input
              id="edit-password"
              type="password"
              prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
              placeholder="如不需修改密码可留空"
            />
          </div>
          <div id="edit-enabled" style={{padding: 10}}>
            <Checkbox defaultChecked={user.enabled}>启用</Checkbox>
          </div>
        </div>
      ),
    })
  }

  render() {
    const finalColumns: Column<AdminUserModel>[] = [...getColumns(this.context.state.isMobile), {
      key: 'control', title: '功能', format: (t) => (
        <Link onClick={() => this.showEditConfirm(t)}>编辑</Link>
      )
    }]
    return (
      <div className="admin-users">
        <Tabs>
          <Tabs.TabPane tab="用户列表" key="1">
            {this.state.message && (
              <Alert message={this.state.message} type="error"/>
            )}
            {this.state.users && (
              <Table rows={this.state.users} columns={finalColumns}/>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="添加用户" key="2">
            <div style={{padding: 10}}>
              <Input
                id="save-username"
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                placeholder="请输入用户名"
              />
            </div>
            <div style={{padding: 10}}>
              <Input
                id="save-password"
                type="password"
                prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
                placeholder="请输入密码"
              />
            </div>
            <div style={{padding: '5px 10px'}}>
              <Button type="primary" onClick={this.saveUser}>添加用户</Button>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}
