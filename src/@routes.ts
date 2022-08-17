import { lazy } from 'react'
import Console from './pages/@console/Console'
import DiscDetailOfAsin from './pages/@disc/DiscDetail/DiscDetailOfAsin'
import DiscDetailOfId from './pages/@disc/DiscDetail/DiscDetailOfId'
import DiscsOfDiscGroup from './pages/@disc/Discs/DiscsOfDiscGroup'
import DiscComing from './pages/@discComing/DiscComing'
import DiscGroupAdd from './pages/@discGroup/DiscGroupAdd/DiscGroupAdd'
import DiscGroupDetail from './pages/@discGroup/DiscGroupDetail/DiscGroupDetail'
import DiscGroupItems from './pages/@discGroup/DiscGroupItems/DiscGroupItems'
import DiscGroups from './pages/@discGroup/DiscGroups/DiscGroups'
import UserAdd from './pages/@user/UserAdd/UserAdd'
import UserDetail from './pages/@user/UserDetail/UserDetail'
import Users from './pages/@user/Users/Users'

export interface RouteInfo {
  path: string
  role?: string
  exact?: boolean
  title?: string
  loader: any
}

export const routes: RouteInfo[] = [
  {
    path: '/disc_coming',
    loader: DiscComing,
  },
  {
    path: '/disc_groups',
    loader: DiscGroups,
  },
  {
    path: '/disc_groups/add',
    loader: DiscGroupAdd,
  },
  {
    path: '/disc_groups/:key',
    loader: DiscGroupDetail,
  },
  {
    path: '/disc_groups/:key/discs',
    loader: DiscGroupItems,
  },
  {
    path: '/discs/disc_groups/:key',
    loader: DiscsOfDiscGroup,
  },
  {
    path: '/discs/asin/:asin',
    loader: DiscDetailOfAsin,
  },
  {
    path: '/discs/:id',
    loader: DiscDetailOfId,
  },
  {
    path: '/discs/:id/records',
    loader: lazy(
      () => import(/* webpackChunkName: "disc_records" */ './pages/@disc/DiscRecords/DiscRecords')
    ),
  },
  {
    path: '/users',
    loader: Users,
  },
  {
    path: '/users/add',
    loader: UserAdd,
  },
  {
    path: '/users/:id',
    loader: UserDetail,
  },
  {
    path: '/console',
    loader: Console,
  },
]
