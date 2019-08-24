export interface RouteInfo {
  path: string
  role?: string
  exact?: boolean
  title?: string
  loader: () => Promise<any>
}

export const routes: RouteInfo[] = [
  {path: '/disc_coming', loader: () => import(/* webpackChunkName: "disc_coming" */ './pages/DiscComing/DiscComing')},
  {path: '/disc_groups', loader: () => import(/* webpackChunkName: "disc_groups" */'./pages/DiscGroups/index')},
  {path: '/disc_groups/add', loader: () => import(/* webpackChunkName: "disc_group_add" */'./pages/DiscGroupAdd/DiscGroupAdd')},
  {path: '/disc_groups/:key', loader: () => import(/* webpackChunkName: "disc_group_detail" */'./pages/DiscGroupDetail/index')},
  {path: '/disc_groups/:key/discs', loader: () => import(/* webpackChunkName: "disc_group_items" */'./pages/DiscGroupItems/index')},
  {path: '/discs/disc_groups/:key', loader: () => import(/* webpackChunkName: "discs_of_disc_group" */'./pages/Discs/DiscsOfDiscGroup')},
  {path: '/discs/asin/:asin', loader: () => import(/* webpackChunkName: "disc_detail_of_asin" */'./pages/DiscDetail/DiscDetailOfAsin')},
  {path: '/discs/:id', loader: () => import(/* webpackChunkName: "disc_detail_of_id" */'./pages/DiscDetail/DiscDetailOfId')},
  {path: '/discs/:id/records', loader: () => import(/* webpackChunkName: "disc_records" */'./pages/DiscRecords/DiscRecords')},
  {path: '/users', loader: () => import(/* webpackChunkName: "users" */'./pages/Users/Users')},
  {path: '/users/add', loader: () => import(/* webpackChunkName: "user_add" */'./pages/UserAdd/UserAdd')},
  {path: '/users/:id', loader: () => import(/* webpackChunkName: "user_detail" */'./pages/UserDetail/UserDetail')},
]
