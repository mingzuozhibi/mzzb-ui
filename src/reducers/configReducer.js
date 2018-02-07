import produce from 'immer'

const ACTION_LOAD_CONFIG = '@@config/LOAD_CONFIG'
const ACTION_SAVE_CONFIG = '@@config/SAVE_CONFIG'

const initState = {}

export default function configReducer(state = initState, action) {
  switch (action.type) {
    case ACTION_LOAD_CONFIG:
      return loadConfigFromStorage()
    case ACTION_SAVE_CONFIG:
      return saveConfigToStorage(produce(state, draft => {
        draft[action.name] = draft[action.data]
      }))
    default:
      return state
  }
}

export function loadConfig() {
  return {
    type: ACTION_LOAD_CONFIG
  }
}

export function saveConfig(name, data) {
  return {
    type: ACTION_SAVE_CONFIG,
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
  localStorage[__CONFIG_KEY__] = JSON.stringify(config)
  return config
}
