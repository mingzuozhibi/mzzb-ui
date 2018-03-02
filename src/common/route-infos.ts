import { pageInfo as listPage } from '../components/list/reducer'
import { pageInfo as userPage } from '../components/user/reducer'

type Role = 'ROLE_ADMIN' | 'ROLE_BASIC'

export interface PageInfo {
  pageTitle: string // 管理用户
  matchPath: string // /admin/user
  pageModel: string // AdminUser
  modelName: string // 用户
  searchFor: string // key
  component: () => any
}

export interface MenuInfo {
  icon: string
  text: string
  path: string
  role?: Role
  subMenus?: MenuInfo[]
}

export const pageInfos: PageInfo[] = [
  userPage
]

const fromPage = (pageInfo: PageInfo, icon: string, role?: Role) => {
  pageInfos.push(pageInfo)
  return {
    icon, role, path: pageInfo.matchPath, text: pageInfo.pageTitle
  }
}

export const menuInfos: MenuInfo[] = [
  {
    icon: 'home',
    text: '首页',
    path: '/home',
  },
  fromPage(listPage, 'icon-yinghua'),
  {
    icon: 'profile',
    text: '后台管理',
    path: '/admin',
    role: 'ROLE_BASIC',
    subMenus: [
      {
        icon: 'icon-yinghua',
        text: '管理列表',
        path: '/list/edit',
        role: 'ROLE_BASIC',
      },
      {
        icon: 'user',
        text: '管理用户',
        path: '/user/edit',
        role: 'ROLE_ADMIN',
      },
    ]
  },
  {
    icon: 'icon-social-tieba',
    text: '名作之壁吧',
    path: 'https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81',
  },
  {
    icon: 'github',
    text: 'Github - UI',
    path: 'https://github.com/mingzuozhibi/mzzb-ui',
  }, {
    icon: 'github',
    text: 'Github - Server',
    path: 'https://github.com/mingzuozhibi/mzzb-server',
  },
]
