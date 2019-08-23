export interface RouteInfo {
  path: string
  role?: string
  exact?: boolean
  title?: string
  loader: () => Promise<any>
}

export const routes: RouteInfo[] = [
  {path: '/disc_coming', loader: () => import('./pages/DiscComing/DiscComing')},
  {path: '/disc_groups', exact: true, loader: () => import('./pages/DiscGroups/index')},
  {path: '/disc_groups/add', loader: () => import('./pages/DiscGroupAdd/DiscGroupAdd')},
  {path: '/disc_groups/:key', exact: true, loader: () => import('./pages/DiscGroupDetail/index')},
  {path: '/disc_groups/:key/discs', loader: () => import('./pages/DiscGroupItems/index')},
  {path: '/discs/disc_groups/:key', loader: () => import('./pages/Discs/DiscsOfDiscGroup')},
  {path: '/discs/:id', exact: true, loader: () => import('./pages/DiscDetail/index')},
  {path: '/discs/:id/records', loader: () => import('./pages/DiscRecords/DiscRecords')},
  {path: '/users', exact: true, loader: () => import('./pages/Users/Users')},
  {path: '/users/add', loader: () => import('./pages/UserAdd/UserAdd')},
  {path: '/users/:id', loader: () => import('./pages/UserDetail/UserDetail')},
]
