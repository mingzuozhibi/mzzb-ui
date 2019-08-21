export interface RouteInfo {
  path: string
  exact?: boolean
  title?: string
  loader: () => Promise<any>
}

export const routes: RouteInfo[] = [
  {path: '/disc_coming', loader: () => import('./pages/DiscComing/DiscComing')},
  {path: '/disc_groups', loader: () => import('./pages/DiscGroups/DiscGroups')},
  {path: '/discs/disc_groups/:key', loader: () => import('./pages/Discs/DiscsOfDiscGroup')},
  {path: '/discs/:id/records', loader: () => import('./pages/DiscRecords/DiscRecords')},
]
