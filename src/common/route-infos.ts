export type RouteInfo = HasRoutes | NotRoutes | SiteLink | DetailPath

interface RouteCommon {
  type: 'HasRoutes' | 'NotRoutes' | 'SiteLink' | 'DetailPath'
  role?: 'ROLE_ADMIN' | 'ROLE_BASIC'
}

interface HasRoutes extends RouteCommon {
  type: 'HasRoutes'
  icon: string
  text: string
  path: string
  routes: RouteInfo[]
}

interface NotRoutes extends RouteCommon {
  type: 'NotRoutes'
  icon: string
  text: string
  path: string
  component: () => any
}

interface SiteLink extends RouteCommon {
  type: 'SiteLink'
  icon: string
  text: string
  path: string
}

interface DetailPath extends RouteCommon {
  type: 'DetailPath'
  path: string
  component: () => any
}

export const routeInfos: RouteInfo[] = [
  {
    type: 'NotRoutes',
    icon: 'home',
    text: '首页',
    path: '/home',
    component: () => import('../components/home')
  },
  {
    type: 'NotRoutes',
    icon: 'icon-yinghua',
    text: 'Sakura',
    path: '/sakura',
    component: () => import('../components/sakura')
  },
  {
    type: 'HasRoutes',
    icon: 'profile',
    text: '后台管理',
    path: '/admin',
    role: 'ROLE_BASIC',
    routes: [
      {
        type: 'NotRoutes',
        icon: 'icon-user',
        text: '用户管理',
        path: '/admin/user',
        role: 'ROLE_ADMIN',
        component: () => import('../components/admin-user')
      },
      {
        type: 'NotRoutes',
        icon: 'icon-yinghua',
        text: 'Sakura管理',
        path: '/admin/sakura',
        role: 'ROLE_BASIC',
        component: () => import('../components/admin-sakura')
      },
    ]
  },
  {
    type: 'SiteLink',
    icon: 'icon-social-tieba',
    text: '名作之壁吧',
    path: 'https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81'
  },
  {
    type: 'SiteLink',
    icon: 'github',
    text: 'Github - UI',
    path: 'https://github.com/mingzuozhibi/mzzb-ui'
  }, {
    type: 'SiteLink',
    icon: 'github',
    text: 'Github - Server',
    path: 'https://github.com/mingzuozhibi/mzzb-server'
  },
]
