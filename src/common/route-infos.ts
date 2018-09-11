import { pageInfo as discPage } from '../components/disc/reducer'
import { pageInfo as sakuraPage } from '../components/sakura/reducer'
import { pageInfo as newdiscPage } from '../components/newdisc/reducer'
import { pageInfo as topdiscPage } from '../components/topdisc/reducer'
import { pageInfo as adminUserPage } from '../components/admin-user/reducer'
import { pageInfo as adminSakuraPage } from '../components/admin-sakura/reducer'

type Role = 'ROLE_ADMIN' | 'ROLE_BASIC'

export interface PageInfo {
  pageTitle: string // 用户管理
  matchPath: string // /admin/user
  pageModel: string // AdminUser
  modelName: string // 用户
  searchFor: string // key
  component: () => any
}

export interface MenuInfo {
  icon?: string
  text: string
  path: string
  role?: Role
  subMenus?: MenuInfo[]
}

export const pageInfos: PageInfo[] = [
  discPage
]

const fromPage = (pageInfo: PageInfo, icon: string, role?: Role) => {
  pageInfos.push(pageInfo)
  return {
    icon, role, path: pageInfo.matchPath, text: pageInfo.pageTitle
  }
}

export const menuInfos: MenuInfo[] = [
  fromPage(sakuraPage, 'icon-yinghua'),
  fromPage(newdiscPage, 'icon-yinghua'),
  fromPage(topdiscPage, 'icon-yinghua'),
  {
    icon: 'profile',
    text: '后台管理',
    path: '/admin',
    role: 'ROLE_BASIC',
    subMenus: [
      fromPage(adminUserPage, 'icon-user', 'ROLE_ADMIN'),
      fromPage(adminSakuraPage, 'icon-yinghua', 'ROLE_BASIC'),
    ]
  },
  {
    icon: 'icon-social-tieba',
    text: '推荐专贴',
    path: '/zhuantie',
    subMenus: [
      {
        text: '日本票房综合讨论楼V3',
        path: 'https://tieba.baidu.com/p/4803602533?pn=9999',
      },
      {
        text: '2018夏-PT排名走势',
        path: 'https://tieba.baidu.com/p/5777199371?pn=9999',
      },
      {
        text: '2018夏-长期追踪贴',
        path: 'https://tieba.baidu.com/p/5776069088?pn=9999',
      },
      {
        text: '2018春-PT排名走势',
        path: 'https://tieba.baidu.com/p/5627916964?pn=9999',
      },
      {
        text: '2018春-长期追踪贴',
        path: 'https://tieba.baidu.com/p/5627461603?pn=9999',
      },
    ]
  },
  {
    icon: 'icon-social-tieba',
    text: '推荐专楼',
    path: '/zhuanlou',
    subMenus: [
      /** 1801 */
      {
        text: '紫罗兰永恒花园',
        path: 'https://tieba.baidu.com/p/5500266707?pn=9999',
      },
      /** 1707 */
      {
        text: 'Princess Principal',
        path: 'https://tieba.baidu.com/p/5202234378?pn=9999',
      },
      /** 1704 */
      {
        text: '末日时在做什么？有没有空？可以来拯救吗？',
        path: 'https://tieba.baidu.com/p/5040597877?pn=9999',
      },
      /** 1604 */
      {
        text: 'Re:从零开始的异世界生活',
        path: 'https://tieba.baidu.com/p/4773136352?pn=9999',
      },
    ]
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
    icon: 'icon-social-tieba',
    text: '新碟片反馈专楼',
    path: 'https://tieba.baidu.com/p/5848378452',
  },
  {
    icon: 'icon-buoumaotubiao31',
    text: '日本PT站(Sakura)',
    path: 'http://rankstker.net/index_news.cgi',
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
