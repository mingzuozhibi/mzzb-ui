export interface RouteInfo {
  path: string
  role?: string
  exact?: boolean
  title?: string
  loader: () => Promise<any>
}

export const routes: RouteInfo[] = [
  {
    path: '/disc_coming',
    loader: () => import(/* webpackChunkName: "disc_coming" */ './pages/@discComing/DiscComing')
  },
  {
    path: '/disc_groups',
    loader: () => import(/* webpackChunkName: "disc_groups" */'./pages/@discGroup/DiscGroups/DiscGroups')
  },
  {
    path: '/disc_groups/add',
    loader: () => import(/* webpackChunkName: "disc_group_add" */'./pages/@discGroup/DiscGroupAdd/DiscGroupAdd')
  },
  {
    path: '/disc_groups/:key',
    loader: () => import(/* webpackChunkName: "disc_group_detail" */'./pages/@discGroup/DiscGroupDetail/DiscGroupDetail')
  },
  {
    path: '/disc_groups/:key/discs',
    loader: () => import(/* webpackChunkName: "disc_group_items" */'./pages/@discGroup/DiscGroupItems/DiscGroupItems')
  },
  {
    path: '/discs/disc_groups/:key',
    loader: () => import(/* webpackChunkName: "discs_of_disc_group" */'./pages/@disc/Discs/DiscsOfDiscGroup')
  },
  {
    path: '/discs/asin/:asin',
    loader: () => import(/* webpackChunkName: "disc_detail_of_asin" */'./pages/@disc/DiscDetail/DiscDetailOfAsin')
  },
  {
    path: '/discs/:id',
    loader: () => import(/* webpackChunkName: "disc_detail_of_id" */'./pages/@disc/DiscDetail/DiscDetailOfId')
  },
  {
    path: '/discs/:id/records',
    loader: () => import(/* webpackChunkName: "disc_records" */'./pages/@disc/DiscRecords/DiscRecords')
  },
  {
    path: '/users',
    loader: () => import(/* webpackChunkName: "users" */'./@version/@pages/@user/Users/Users')
  },
  {
    path: '/users/add',
    loader: () => import(/* webpackChunkName: "user_add" */'./@version/@pages/@user/UserAdd/UserAdd')
  },
  {
    path: '/users/:id',
    loader: () => import(/* webpackChunkName: "user_detail" */'./@version/@pages/@user/UserDetail/UserDetail')
  },
  {
    path: '/console',
    loader: () => import(/* webpackChunkName: "console" */'./pages/@console/Console')
  },
]
