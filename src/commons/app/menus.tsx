import { MzIcon } from '#CC/icon/MzIcon'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { NavLink } from 'react-router-dom'

import {
  AmazonOutlined,
  BarChartOutlined,
  CloudOutlined,
  GithubOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { linkToComing, linkToDiscs, linkToGroups, linkToMsgs, linkToUsers } from '#RU/links'

export function buildItems(userRoles: string[]): ItemType[] {
  const hasBasic = userRoles.includes('ROLE_BASIC')
  const hasAdmin = userRoles.includes('ROLE_ADMIN')
  return [
    {
      label: '推荐列表',
      icon: <MzIcon type="icon-yinghua" />,
      key: linkToGroups(),
    },
    {
      label: '上架追踪',
      icon: <AmazonOutlined />,
      key: linkToComing(),
    },
    {
      label: '待选列表',
      icon: <CloudOutlined />,
      key: linkToDiscs(`/add`),
      disabled: !hasBasic,
    },
    {
      label: '查询碟片',
      icon: <SearchOutlined />,
      key: linkToDiscs(`/search`),
    },
    {
      label: '用户管理',
      icon: <UserOutlined />,
      key: linkToUsers(),
      disabled: !hasAdmin,
    },
    {
      label: '系统日志',
      icon: <BarChartOutlined />,
      key: linkToMsgs(),
    },
    {
      label: '名作之壁吧',
      icon: <MzIcon type="icon-social-tieba" />,
      key: 'https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81',
    },
    {
      label: '壁吧专楼吧',
      icon: <MzIcon type="icon-social-tieba" />,
      key: 'https://tieba.baidu.com/f?kw=%E5%A3%81%E5%90%A7%E4%B8%93%E6%A5%BC',
    },
    {
      label: 'Github - UI',
      icon: <GithubOutlined />,
      key: 'https://github.com/mingzuozhibi/mzzb-ui',
    },
    {
      label: 'Github - Server',
      icon: <GithubOutlined />,
      key: 'https://github.com/mingzuozhibi/mzzb-server',
    },
    {
      label: 'Github - Spider',
      icon: <GithubOutlined />,
      key: 'https://github.com/mingzuozhibi/mzzb-spider',
    },
    {
      label: 'Github - Admin',
      icon: <GithubOutlined />,
      key: 'https://github.com/mingzuozhibi/mzzb-admin',
    },
  ]
    .filter((e) => e.disabled !== true)
    .map(addNavLink)
}

function addNavLink(item: any) {
  if (item.children) {
    item.children.forEach(addNavLink)
  } else if (item.key.startsWith('http')) {
    item.label = (
      <a href={item.key} target="_blank" rel="noopener noreferrer">
        {item.label}
      </a>
    )
  } else {
    item.label = <NavLink to={item.key}>{item.label}</NavLink>
  }
  return item
}
