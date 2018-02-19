export type RouteInfo = HasRoutes | NotRoutes | SiteLink

interface RouteCommon {
  icon: string
  text: string
  role?: 'ROLE_ADMIN' | 'ROLE_BASIC'
  type: 'Routes' | 'Route' | 'Link'
}

interface HasRoutes extends RouteCommon {
  type: 'Routes'
  routes: RouteInfo[]
}

interface NotRoutes extends RouteCommon {
  type: 'Route'
  matchPath: string
  component: () => any
}

interface SiteLink extends RouteCommon {
  type: 'Link'
  matchPath: string
}

const routes: RouteInfo[] = [
  {
    icon: 'home',
    text: '首页',
    type: 'Route',
    matchPath: '/home',
    component: () => import('../components/home')
  },
  {
    icon: 'icon-yinghua',
    text: 'Sakura',
    type: 'Route',
    matchPath: '/sakura',
    component: () => import('../components/sakura')
  },
  {
    icon: 'profile',
    text: '后台管理',
    role: 'ROLE_BASIC',
    type: 'Routes',
    routes: [
      {
        icon: 'icon-user',
        text: '用户管理',
        role: 'ROLE_ADMIN',
        type: 'Route',
        matchPath: '/admin/user',
        component: () => import('../components/admin-user')
      },
      {
        icon: 'icon-yinghua',
        text: 'Sakura管理',
        role: 'ROLE_BASIC',
        type: 'Route',
        matchPath: '/basic/sakura',
        component: () => import('../components/basic-sakura')
      },
    ]
  },
  {
    icon: 'icon-social-tieba',
    text: '名作之壁吧',
    type: 'Link',
    matchPath: 'https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81'
  },
  {
    icon: 'github',
    text: 'Github - UI',
    type: 'Link',
    matchPath: 'https://github.com/mingzuozhibi/mzzb-ui'
  }, {
    icon: 'github',
    text: 'Github - Server',
    type: 'Link',
    matchPath: 'https://github.com/mingzuozhibi/mzzb-server'
  },
]

export default routes
