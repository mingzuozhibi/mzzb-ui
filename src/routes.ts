export interface RouteInfo {
  path: string
  role?: string
  exact?: boolean
  title?: string
  loader: () => Promise<any>
}

export const routes: RouteInfo[] = [
  {path: '/disc_coming', loader: () => import('./pages/DiscComing/DiscComing')},
  {path: '/disc_groups', loader: () => import('./pages/DiscGroups/index')},
  {path: '/disc_groups/add', loader: () => import('./pages/DiscGroupAdd/DiscGroupAdd')},
  {path: '/disc_groups/:key', loader: () => import('./pages/DiscGroupDetail/index')},
  {path: '/disc_groups/:key/discs', loader: () => import('./pages/DiscGroupItems/index')},
  {path: '/discs/disc_groups/:key', loader: () => import('./pages/Discs/DiscsOfDiscGroup')},
  {path: '/discs/asin/:asin', loader: () => import('./pages/DiscDetail/DiscDetailOfAsin')},
  {path: '/discs/:id', loader: () => import('./pages/DiscDetail/DiscDetailOfId')},
  {path: '/discs/:id/records', loader: () => import('./pages/DiscRecords/DiscRecords')},
  {path: '/users', loader: () => import('./pages/Users/Users')},
  {path: '/users/add', loader: () => import('./pages/UserAdd/UserAdd')},
  {path: '/users/:id', loader: () => import('./pages/UserDetail/UserDetail')},
]
