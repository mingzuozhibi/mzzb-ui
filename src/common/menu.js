import React from 'react'
import {Icon} from 'antd'
import {Font, Page} from '../libraries'

export default [
  new Page('/home', 'Home', {
    icon: <Icon type="home"/>,
    component: () => import('../components/Home'),
  }),
  new Page('/sakura', 'Sakura', {
    icon: <Font name="icon-yinghua"/>,
    component: () => import('../components/Sakura'),
  }),
  new Page('/admin', '后台管理', {
    active: 'admin',
    icon: <Icon type="profile"/>,
    items: [
      new Page('/admin/user', '用户管理', {
        icon: <Font name="icon-user"/>,
        component: () => import('../components/AdminUser'),
      }),
      new Page('/admin/sakura', 'Sakura管理', {
        icon: <Font name="icon-yinghua"/>,
        component: () => import('../components/AdminSakura'),
      }),
    ],
  }),
  new Page('/404', '404 Not Found', {
    active: 'route',
    component: () => import('../components/NotFound'),
  }),
  new Page('https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81', '名作之壁', {
    active: 'link',
    icon: <Font name="icon-social-tieba"/>,
  }),
  new Page('https://github.com/mingzuozhibi/mzzb-ui', 'GitHub', {
    active: 'link',
    icon: <Icon type="github"/>,
  }),
]
