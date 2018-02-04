import produce from 'immer'

const ACTION_LOAD_CONFIG = '@@config/LOAD_CONFIG'
const ACTION_SAVE_CONFIG = '@@config/SAVE_CONFIG'
const ACTION_UPDATE_CONFIG = '@@config/UPDATE_CONFIG'

const initState = {}

function configReducer(state = initState, action) {
  switch (action.type) {
    case ACTION_LOAD_CONFIG:
      return {...state, ...loadConfigFromStorage()}
    case ACTION_SAVE_CONFIG:
      return saveConfigToStorage(state)
    case ACTION_UPDATE_CONFIG:
      return produce(state, draft => {
        draft[action.name] = action.data
      })
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

export function updateConfig(name, data) {
  return {
    type: ACTION_UPDATE_CONFIG,
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
