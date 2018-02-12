import React from 'react'
import {Alert, Button, Icon, Input, Tabs} from 'antd'
import Table, {Column} from '../../libraries/Table'
import Reload from '../../libraries/Reload'
import {requestSaveUser, requestListUser} from '../../reducers/userReducer'
import {connect} from 'react-redux'
import {alertWarning} from '../../utils/window'

interface User {
  id: number;
  username: string;
  enabled: boolean;
  registerDate: string;
  lastLoggedIn: string;
}

const columns = [
  new Column({
    className: 'id',
    title: 'ID',
    format: (user: User) => user.id,
  }),
  new Column({
    className: 'username',
    title: '用户名',
    format: (user: User) => user.username,
  }),
  new Column({
    className: 'enabled',
    title: '启用',
    format: (user: User) => user.enabled ? '是' : '否',
  }),
  new Column({
    className: 'registerDate',
    title: '注册时间',
    format: (user: User) => user.registerDate,
  }),
  new Column({
    className: 'lastLoggedIn',
    title: '最后登入',
    format: (user: User) => user.lastLoggedIn,
  }),
]

function AdminUser({users, pending, message, handlers}) {

  const {doRequestListUser, doRequestSaveUser} = handlers

  if (!users && !pending && !message) {
    doRequestListUser()
  }

  function handleSaveUser() {
    const username = document.querySelector('#save-user-name').value
    const password = document.querySelector('#save-user-pass').value

    doRequestSaveUser(username, password)
  }

  return (
    <div id="admin-user">
      {message && <Alert message={message} type="error"/>}
      <Tabs>
        <Tabs.TabPane tab="用户列表" key="1">
          {users && users.length > 0 && (
            <Table title="用户列表" rows={users} columns={columns}/>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="添加用户" key="2">
          <div style={{padding: 10}}>
            <Input
              id="save-user-name"
              prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
              placeholder="请输入用户名"
              onPressEnter={() => document.querySelector('#save-user-pass').focus()}
            />
          </div>
          <div style={{padding: 10}}>
            <Input
              id="save-user-pass"
              type="password"
              prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
              placeholder="请输入密码"
              onPressEnter={handleSaveUser}
            />
          </div>
          <div style={{padding: '5px 10px'}}>
            <Button type="primary" onClick={handleSaveUser}>添加用户</Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    users: state.user.users,
    pending: state.user.pending,
    message: state.user.message,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handlers: {
      doRequestListUser() {
        dispatch(requestListUser())
      },
      doRequestSaveUser(username, password) {
        if (!username || !password) {
          alertWarning('请检查输入项', '你必须输入用户名和密码')
        } else {
          dispatch(requestSaveUser(username, password))
        }
      },
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUser)

export const adminUserIcons = [
  <Reload
    key="reload"
    action={requestListUser()}
    isPending={(state) => state.user.pending}
  />,
]
