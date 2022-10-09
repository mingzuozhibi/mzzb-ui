import { composeCompares } from '#CU/compare'
import { IGroup } from '#DT/disc'
import { viewTypes } from '#DT/metas'
import { formatTimeout } from '#RU/timeout'

const sorts = viewTypes.map((e) => e.value)

export const compareGroups = composeCompares<IGroup>(
  (a, b) => sorts.indexOf(a.viewType) - sorts.indexOf(b.viewType),
  (a, b) => b.key.localeCompare(a.key)
)

export const formatUpdate = (group: IGroup) => {
  if (!group.enabled || !group.modifyTime) return '停止更新'
  return formatTimeout(group.modifyTime)
}
