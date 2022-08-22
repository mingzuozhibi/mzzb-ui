export function linkToDisc(id: number) {
  return `/discs/${id}`
}

export function linkToGroup(key: string) {
  return `/disc_groups/${key}`
}

export function linkToGroupViewList(key: string) {
  return `/disclist/group/${key}`
}

export function linkToGroupEditList(key: string) {
  return `/disclist/group/${key}/edit`
}
