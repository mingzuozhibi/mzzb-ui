import {Table} from '../libraries'

export interface User {
  id: number;
  username: string;
  enabled: boolean;
  registerDate: string;
  lastLoggedIn: string;
}

const id = new Table.Column({
  className: 'id',
  title: 'ID',
  format: (user: User) => user.id,
})

const username = new Table.Column({
  className: 'username',
  title: '用户名',
  format: (user: User) => user.username,
})

const enabled = new Table.Column({
  className: 'enabled',
  title: '启用',
  format: (user: User) => user.enabled ? '是' : '否',
})

const registerDate = new Table.Column({
  className: 'registerDate',
  title: '注册时间',
  format: (user: User) => user.registerDate,
})

const lastLoggedIn = new Table.Column({
  className: 'lastLoggedIn',
  title: '最后登入',
  format: (user: User) => user.lastLoggedIn,
})

export const userColumns = {id, username, enabled, registerDate, lastLoggedIn}
