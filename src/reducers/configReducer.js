import produce from 'immer'

const ACTION_SET_CONFIG = '@@config/SET_CONFIG'

const loadState = loadConfig()
const initState = {...loadState}

export default function configReducer(state = initState, action) {
  switch (action.type) {
    case ACTION_SET_CONFIG:
      return saveConfig(produce(state, draft => {
        draft[action.name] = action.sakuras
      }))
    default:
      return state
  }
}

export function setConfig(name, data) {
  return {
    type: ACTION_SET_CONFIG,
    name: name,
    data: data,
  }
}

const __CONFIG_KEY__ = '__config__'

function loadConfig() {
  const config = localStorage[__CONFIG_KEY__]
  return config ? JSON.parse(config) : initState
}

function saveConfig(config) {
  localStorage[__CONFIG_KEY__] = JSON.stringify(config)
  return config
}
