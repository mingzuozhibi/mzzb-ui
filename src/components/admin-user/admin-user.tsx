import * as React from 'react'
import { Alert, Button, Checkbox, Input, Modal, Tabs } from 'antd'
import { Column, Table } from '../../lib/table'
import { Link } from '../../lib/link'
import { Icon } from '../../lib/icon'

import { Manager, md5Password, Model } from '../../utils/manager'
import { BaseComponent, State } from '../BaseComponent'

interface UserModel extends Model {
  username: string
  enabled: boolean
  registerDate: string
  lastLoggedIn: string
}

interface UserState extends State<UserModel> {
}

export class AdminUser extends BaseComponent<UserModel, UserState> {

  state: UserState = {}

  manager: Manager<UserModel> = new Manager('/api/admin/users')

  formSave: any = {}
  formEdit: any = {}

  saveUser = async () => {
    const username = this.formSave.username
    const password = this.formSave.password

    if (!username || !password) {
      Modal.warning({title: '请检查输入项', content: '你必须输入用户名和密码'})
      return
    }

    const encode = md5Password(username, password)
    const result = await this.manager.addOne({username, password: encode})

    this.saveModel('添加用户错误', result)
  }

  editUser = async (id: number) => {
    const username = this.formEdit.username
    const password = this.formEdit.password
    const enabled = this.formEdit.enabled

    if (!username) {
      Modal.warning({title: '请检查输入项', content: '你必须输入用户名'})
      return
    }

    const encode = password ? md5Password(username, password) : ''
    const result = await this.manager.update({
      id, username, password: encode, enabled
    })

    if (result.success) {
      const user = result.data
      this.update(draft => {
        draft.models = draft.models!.map(u => u.id === user.id ? user : u)
      })
    } else {
      Modal.error({title: '编辑用户错误', content: result.message})
    }
  }

  componentWillMount() {
    this.listModelSupport(() => {
      return this.manager.findAll()
    })
  }

  columns: Column<UserModel>[] = [
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
      format: (t) => this.formatLong(t.registerDate, 0, 10)
    },
    {
      key: 'lastLoggedIn',
      title: '最后登入',
      format: (t) => this.formatLong(t.lastLoggedIn, 5, 11)
    },
    {
      key: 'extra-control',
      title: '功能',
      format: (t) => <Link onClick={() => this.showEditModal(t)}>编辑</Link>
    }
  ]

  formatLong = (text: string, start: number, length: number) => {
    return this.context.state.bodyWidth <= 600 ? text.substr(start, length) : text
  }

  render() {
    return (
      <div className="admin-users">
        <Tabs>
          <Tabs.TabPane tab="用户列表" key="1">
            {this.state.errors && (
              <Alert message={this.state.errors} type="error"/>
            )}
            {this.state.models && (
              <Table rows={this.state.models} columns={this.columns}/>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="添加用户" key="2">
            <div style={{padding: 10}}>
              <Input
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                onChange={e => this.formSave.username = e.target.value}
                placeholder="请输入用户名"
              />
            </div>
            <div style={{padding: 10}}>
              <Input
                type="password"
                onChange={e => this.formSave.password = e.target.value}
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

  showEditModal(user: UserModel) {
    this.formEdit.username = user.username
    this.formEdit.enabled = user.enabled

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
              prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
              defaultValue={user.username}
              onChange={e => this.formEdit.username = e.target.value}
              placeholder="请输入用户名"
            />
          </div>
          <div style={{padding: 10}}>
            <Input
              type="password"
              prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
              onChange={e => this.formEdit.password = e.target.value}
              placeholder="如不需修改密码可留空"
            />
          </div>
          <div style={{padding: 10}}>
            <Checkbox
              defaultChecked={user.enabled}
              onChange={e => this.formEdit.enabled = e.target.checked}
            >
              启用
            </Checkbox>
          </div>
        </div>
      ),
    })
  }
}
