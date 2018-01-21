const ACTION_LOAD_CONFIG = '@@config/LOAD_CONFIG'
const ACTION_SAVE_CONFIG = '@@config/SAVE_CONFIG'
const ACTION_UPDATE_GLOBAL_CONFIG = '@@config/UPDATE_GLOBAL_CONFIG'
const ACTION_UPDATE_LOCALS_CONFIG = '@@config/UPDATE_LOCALS_CONFIG'

const initState = {
  global: {}, locals: {}
}

function configReducer(state = initState, action) {
  switch (action.type) {
    case ACTION_LOAD_CONFIG:
      return {...state, ...loadConfigFromStorage()}
    case ACTION_SAVE_CONFIG:
      return saveConfigToStorage(state)
    case ACTION_UPDATE_GLOBAL_CONFIG:
      return {...state, global: mergeConfig(state.global, action.name, action.data)}
    case ACTION_UPDATE_LOCALS_CONFIG:
      const config = state.locals
      const name = action.local
      const data = mergeConfig(config[name], action.name, action.data)
      return {...state, locals: mergeConfig(config, name, data)}
    default:
      return state
  }
}

export default configReducer

export function loadConfig() {
  return {
    type: ACTION_LOAD_CONFIG
  }
}

export function saveConfig() {
  return {
    type: ACTION_SAVE_CONFIG
  }
}

export function updateGlobalConfig(name, data) {
  return {
    type: ACTION_UPDATE_GLOBAL_CONFIG,
    name: name,
    data: data,
  }
}

export function updateLocalsConfig(local, name, data) {
  return {
    type: ACTION_UPDATE_LOCALS_CONFIG,
    local: local,
    name: name,
    data: data,
  }
}

const __CONFIG_KEY__ = '__config__'

function loadConfigFromStorage() {
  const config = localStorage[__CONFIG_KEY__]
  return config ? JSON.parse(config) : initState
}

function saveConfigToStorage(config) {
  const toSave = config || initState
  localStorage[__CONFIG_KEY__] = JSON.stringify(toSave)
  return toSave
}

function mergeConfig(config = {}, name, data) {
  return {...config, [name]: data}
}

