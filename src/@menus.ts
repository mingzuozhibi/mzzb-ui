type Role = 'ROLE_ADMIN' | 'ROLE_BASIC'

export interface MenuInfo {
  icon?: string
  text: string
  path: string
  role?: Role
  subMenus?: MenuInfo[]
}

export const menuInfos: MenuInfo[] = [
  {
    icon: 'icon-yinghua',
    text: '推荐列表',
    path: '/disc_groups',
  },
  {
    icon: 'icon-yinghua',
    text: '上架追踪',
    path: '/disc_coming',
  },
  {
    icon: 'icon-user',
    text: '用户管理',
    path: '/users',
    role: 'ROLE_ADMIN'
  },
  {
    icon: 'icon-social-tieba',
    text: '名作之壁吧',
    path: 'https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81',
  },
  {
    icon: 'icon-social-tieba',
    text: '壁吧专楼吧',
    path: 'https://tieba.baidu.com/f?kw=%E5%A3%81%E5%90%A7%E4%B8%93%E6%A5%BC',
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
