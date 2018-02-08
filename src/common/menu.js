import React from 'react'
import {Icon} from 'antd'
import IconFont from '../libraries/IconFont'
import Item from '../libraries/Item'

export default [
  new Item('/home', 'Home', {
    icon: <Icon type="home"/>,
    component: () => import('../components/Home'),
  }),
  new Item('/sakura', 'Sakura', {
    icon: <IconFont type="icon-yinghua"/>,
    component: () => import('../components/Sakura'),
  }),
  new Item('/admin', '后台管理', {
    active: 'admin',
    icon: <Icon type="profile"/>,
    items: [
      new Item('/admin/user', '用户管理', {
        icon: <IconFont type="icon-user"/>,
        component: () => import('../components/AdminUser'),
      }),
      new Item('/admin/sakura', 'Sakura管理', {
        icon: <IconFont type="icon-yinghua"/>,
        component: () => import('../components/AdminSakura'),
      }),
    ],
  }),
  new Item('/404', '404 Not Found', {
    active: 'route',
    component: '../components/NotFound',
  }),
  new Item('https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81', '名作之壁', {
    active: 'link',
    icon: <IconFont type="icon-social-tieba"/>,
  }),
  new Item('https://github.com/mingzuozhibi/mzzb-ui', 'GitHub', {
    active: 'link',
    icon: <Icon type="github"/>,
  }),
]
