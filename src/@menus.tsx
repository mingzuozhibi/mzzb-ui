import React from 'react'
import { Github as GithubIcon } from '@ant-design/icons'

type Role = 'ROLE_ADMIN' | 'ROLE_BASIC'

export interface MenuInfo {
  matchPath: string
  menuTitle: string
  menuRole?: Role
  iconType?: string
  iconNode?: JSX.Element
}

export const menuInfos: MenuInfo[] = [
  {
    iconType: 'icon-yinghua',
    menuTitle: '推荐列表',
    matchPath: '/disc_groups',
  },
  {
    iconType: 'icon-yinghua',
    menuTitle: '上架追踪',
    matchPath: '/disc_coming',
  },
  {
    iconType: 'icon-user',
    menuTitle: '用户管理',
    matchPath: '/users',
    menuRole: 'ROLE_ADMIN'
  },
  {
    iconType: 'icon-social-tieba',
    menuTitle: '名作之壁吧',
    matchPath: 'https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81',
  },
  {
    iconType: 'icon-social-tieba',
    menuTitle: '壁吧专楼吧',
    matchPath: 'https://tieba.baidu.com/f?kw=%E5%A3%81%E5%90%A7%E4%B8%93%E6%A5%BC',
  },
  {
    iconNode: <GithubIcon/>,
    menuTitle: 'Github - UI',
    matchPath: 'https://github.com/mingzuozhibi/mzzb-ui',
  }, {
    iconNode: <GithubIcon/>,
    menuTitle: 'Github - Server',
    matchPath: 'https://github.com/mingzuozhibi/mzzb-server',
  },
]
