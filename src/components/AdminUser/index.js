import React from 'react'
import {Alert} from 'antd'
import Table, {Column} from '../../libraries/Table'
import Reload from '../../libraries/Reload'
import {requestUsers} from '../../reducers/userReducer'
import {connect} from 'react-redux'

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

function AdminUser({users, pending, message, doRequestUsers}) {

  if (!users && !pending && !message) {
    doRequestUsers()
  }

  return (
    <div id="admin-user">
      {message && <Alert message={message} type="error"/>}
      {users && users.length > 0 && (
        <Table title="用户列表" rows={users} columns={columns}/>
      )}
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
    doRequestUsers() {
      dispatch(requestUsers())
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
    action={requestUsers()}
    isPending={(state) => state.user.pending}
  />,
]
