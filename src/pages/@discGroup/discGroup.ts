export interface DiscGroup {
  id: number
  key: string
  title: string
  enabled: boolean
  viewType: string
  discsSize: number
  modifyTime: number
}

export const viewTypes = [
  {label: '日亚实时', value: 'SakuraList'},
  {label: '公开列表', value: 'PublicList'},
  {label: '私有列表', value: 'PrivateList'},
]
