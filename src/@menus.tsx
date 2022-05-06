import { BarChartOutlined, GithubOutlined } from '@ant-design/icons'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { NavLink } from 'react-router-dom'
import { CustomIcon } from './comps/CustomIcon'

export function useItems(userRoles: string[]): ItemType[] {
  return [
    { label: '推荐列表', icon: <CustomIcon iconType="icon-yinghua" />, key: '/disc_groups' },
    { label: '上架追踪', icon: <CustomIcon iconType="icon-yinghua" />, key: '/disc_coming' },
    {
      label: '用户管理',
      icon: <CustomIcon iconType="icon-user" />,
      key: '/users',
      disabled: !userRoles.includes('ROLE_ADMIN'),
    },
    { label: '系统日志', icon: <BarChartOutlined />, key: '/console' },
    {
      label: '名作之壁吧',
      icon: <CustomIcon iconType="icon-social-tieba" />,
      key: 'https://tieba.baidu.com/f?kw=%E5%90%8D%E4%BD%9C%E4%B9%8B%E5%A3%81',
    },
    {
      label: '壁吧专楼吧',
      icon: <CustomIcon iconType="icon-social-tieba" />,
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
