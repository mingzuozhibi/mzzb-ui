export type RouteInfo = HasRoutes | NotRoutes | SiteLink

interface RouteCommon {
  icon: string
  text: string
  path: string
  type: 'Routes' | 'Route' | 'Link'
  role?: 'ROLE_ADMIN' | 'ROLE_BASIC'
}

interface HasRoutes extends RouteCommon {
  type: 'Routes'
  routes: RouteInfo[]
}

interface NotRoutes extends RouteCommon {
  type: 'Route'
  component: () => any
}

interface SiteLink extends RouteCommon {
  type: 'Link'
}

const routes: RouteInfo[] = [
  {
    icon: 'home',
    text: '首页',
    path: '/home',
    type: 'Route',
    component: () => import('../components/home')
  },
  {
    icon: 'icon-yinghua',
    text: 'Sakura',
    path: '/sakura',
    type: 'Route',
    component: () => import('../components/sakura')
  },
  {
    icon: 'profile',
    text: '后台管理',
    path: '/admin',
    type: 'Routes',
    role: 'ROLE_BASIC',
    routes: [
      {
        icon: 'icon-user',
        text: '用户管理',
        path: '/admin/user',
        type: 'Route',
        role: 'ROLE_ADMIN',
        component: () => import('../components/admin-user')
      },
      {
        icon: 'icon-yinghua',
        text: 'Sakura管理',
        path: '/basic/sakura',
        type: 'Route',
        role: 'ROLE_BASIC',
        component: () => import('../components/admin-sakura')
      },
    ]
  },
  {
    icon: 'icon-social-tieba',
    text: '名作之壁吧',
    type: 'Link',
    path: 'https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81'
  },
  {
    icon: 'github',
    text: 'Github - UI',
    type: 'Link',
    path: 'https://github.com/mingzuozhibi/mzzb-ui'
  }, {
    icon: 'github',
    text: 'Github - Server',
    type: 'Link',
    path: 'https://github.com/mingzuozhibi/mzzb-server'
  },
]

export default routes
