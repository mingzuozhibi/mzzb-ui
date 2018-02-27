export type RouteInfo = Simple | Routes | Link

interface RouteCommon {
  icon: string
  text: string
  path: string
  type: 'Simple' | 'Routes' | 'Link'
  role?: 'ROLE_ADMIN' | 'ROLE_BASIC'
}

export interface Simple extends RouteCommon {
  type: 'Simple'
  model?: string
  search?: string
  component: () => any
}

interface Routes extends RouteCommon {
  type: 'Routes'
  routes: RouteInfo[]
}

interface Link extends RouteCommon {
  type: 'Link'
}

export const routeInfos: RouteInfo[] = [
  {
    type: 'Simple',
    icon: 'home',
    text: '首页',
    path: '/home',
    model: undefined,
    component: () => import('../components/home')
  },
  {
    type: 'Simple',
    icon: 'icon-yinghua',
    text: '日亚实时',
    path: '/sakura',
    model: 'Sakura',
    search: 'key',
    component: () => import('../components/sakura')
  },
  {
    type: 'Simple',
    icon: 'icon-yinghua',
    text: '公开列表',
    path: '/public',
    model: 'Public',
    search: 'key',
    component: () => import('../components/public')
  },
  {
    type: 'Routes',
    icon: 'profile',
    text: '后台管理',
    path: '/admin',
    role: 'ROLE_BASIC',
    routes: [
      {
        type: 'Simple',
        icon: 'icon-user',
        text: '用户管理',
        path: '/admin/user',
        role: 'ROLE_ADMIN',
        model: 'AdminUser',
        component: () => import('../components/admin-user')
      },
      {
        type: 'Simple',
        icon: 'icon-yinghua',
        text: '列表管理',
        path: '/admin/sakura',
        role: 'ROLE_BASIC',
        model: 'AdminSakura',
        search: 'key',
        component: () => import('../components/admin-sakura')
      },
    ]
  },
  {
    type: 'Link',
    icon: 'icon-social-tieba',
    text: '名作之壁吧',
    path: 'https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81'
  },
  {
    type: 'Link',
    icon: 'github',
    text: 'Github - UI',
    path: 'https://github.com/mingzuozhibi/mzzb-ui'
  }, {
    type: 'Link',
    icon: 'github',
    text: 'Github - Server',
    path: 'https://github.com/mingzuozhibi/mzzb-server'
  },
]
