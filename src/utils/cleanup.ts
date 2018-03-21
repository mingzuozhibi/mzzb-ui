export function cleanup(version: string) {
  const local = localStorage

  if (local.getItem('version') !== version) {
    const keys = ['X-AUTO-LOGIN']
    const vals = {}
    keys.forEach(key => {
      vals[key] = local.getItem(key)
    })
    local.clear()
    keys.forEach(key => {
      local.setItem(key, vals[key])
    })
    local.setItem('version', version)
  }
}
