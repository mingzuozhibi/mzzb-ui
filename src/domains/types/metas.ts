interface IOption {
  label: string
  value: string
}

export const viewTypes: IOption[] = [
  {
    label: '日亚实时',
    value: 'SakuraList',
  },
  {
    label: '公开列表',
    value: 'PublicList',
  },
  {
    label: '私有列表',
    value: 'PrivateList',
  },
]

export const msgModules: IOption[] = [
  {
    label: '排名抓取',
    value: 'SPIDER_CONTENT',
  },
  {
    label: '上架抓取',
    value: 'SPIDER_HISTORY',
  },
  {
    label: '核心日志',
    value: 'SERVER_CORE',
  },
  {
    label: '用户日志',
    value: 'SERVER_USER',
  },
  {
    label: '碟片日志',
    value: 'SERVER_DISC',
  },
  {
    label: '其他日志',
    value: 'DEFAULT',
  },
]

export const msgLevels: IOption[] = [
  {
    label: '调试',
    value: 'DEBUG',
  },
  {
    label: '信息',
    value: 'INFO',
  },
  {
    label: '通知',
    value: 'NOTIFY',
  },
  {
    label: '成功',
    value: 'SUCCESS',
  },
  {
    label: '警告',
    value: 'WARNING',
  },
  {
    label: '错误',
    value: 'ERROR',
  },
]

export const comingTypes = [
  'Blu-ray',
  'DVD',
  'セット買い',
  'その他',
  '4K',
  'CD',
  'コミック',
  'DVD Audio',
  '3D',
  'Blu-ray Audio',
  '単行本',
  'HD DVD',
  '楽譜',
  'ホーム&キッチン',
  '大型本',
  'オフィス用品',
  'おもちゃ＆ホビー',
  'VHSテープ',
]
