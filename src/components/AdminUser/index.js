import React from 'react'
import {Alert, Button, Checkbox, Icon, Input, Modal, Tabs} from 'antd'
import {Link, Table} from '../../libraries'
import {editUser, listUser, saveUser} from '../../reducers/userReducer'
import {alertWarning} from '../../utils/window'
import {regReload} from '../../reducers/layoutReducer'
import connect from '../../utils/connect'
import {User, userColumns} from '../../common/user'

const columns = [
  userColumns.id,
  userColumns.username,
  userColumns.enabled,
  userColumns.registerDate,
  userColumns.lastLoggedIn,
]

function showEditConfirm(user: User, handleEditUser) {
  Modal.confirm({
    title: '编辑用户',
    okText: '保存',
    okType: 'primary',
    onOk: () => handleEditUser(user.id),
    cancelText: '取消',
    content: (
      <div>
        <div style={{padding: 10}}>
          <Input
            id="edit-user-name"
            defaultValue={user.username}
            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
            placeholder="请输入用户名"
          />
        </div>
        <div style={{padding: 10}}>
          <Input
            id="edit-user-pass"
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

function getControlColumn(handleEditUser) {
  return new Table.Column({
    className: 'control',
    title: '功能',
    format: (user: User) => (
      <Link onClick={() => showEditConfirm(user, handleEditUser)}>编辑</Link>
    ),
  })
}

function AdminUser({users, pending, message, dispatch}) {

  if (!users && !pending && !message) {
    dispatch(listUser())
  }

  function handleSaveUser() {
    const username = document.querySelector('#save-user-name').value
    const password = document.querySelector('#save-user-pass').value

    if (!username || !password) {
      alertWarning('请检查输入项', '你必须输入用户名和密码')
    } else {
      dispatch(saveUser(username, password))
    }
  }

  function handleEditUser(id) {
    const username = document.querySelector('#edit-user-name').value
    const password = document.querySelector('#edit-user-pass').value
    const enabled = document.querySelector('#edit-enabled input').checked

    if (!username) {
      alertWarning('请检查输入项', '你必须输入用户名')
    } else {
      dispatch(editUser({id, username, password, enabled}))
    }
  }

  const finalColumns = [...columns, getControlColumn(handleEditUser)]

  return (
    <div id="admin-user">
      {message && <Alert message={message} type="error"/>}
      <Tabs>
        <Tabs.TabPane tab="用户列表" key="1">
          {users && users.length > 0 && (
            <Table title="用户列表" rows={users} columns={finalColumns}/>
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

function mapState(state) {
  return {
    users: state.user.users,
    pending: state.user.pending,
    message: state.user.message,
  }
}

export default connect(mapState, (dispatch) => {
  dispatch(regReload(listUser(), (state) => state.user.pending))
}, AdminUser)
