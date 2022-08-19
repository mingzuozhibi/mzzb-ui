import Console from '#P/@console/Console'
import DiscDetailOfAsin from '#P/@disc/DiscDetail/DiscDetailOfAsin'
import DiscDetailOfId from '#P/@disc/DiscDetail/DiscDetailOfId'
import DiscsOfDiscGroup from '#P/@disc/Discs/DiscsOfDiscGroup'
import DiscComing from '#P/@discComing/DiscComing'
import DiscGroupAdd from '#P/@discGroup/DiscGroupAdd/DiscGroupAdd'
import DiscGroupDetail from '#P/@discGroup/DiscGroupDetail/DiscGroupDetail'
import DiscGroupItems from '#P/@discGroup/DiscGroupItems/DiscGroupItems'
import DiscGroups from '#P/@discGroup/DiscGroups/DiscGroups'
import UserAdd from '#P/@user/UserAdd/UserAdd'
import UserDetail from '#P/@user/UserDetail/UserDetail'
import Users from '#P/@user/Users/Users'
import { lazy } from 'react'

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
      () => import(/* webpackChunkName: "disc_records" */ '#P/@disc/DiscRecords/DiscRecords')
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
