const ACTION_UPDATE_SAKURA = '@@sakura/UPDATE_SAKURA'

const initState = {
  data: []
}

export default function sakuraReducer(state = initState, action) {
  switch (action.type) {
    case ACTION_UPDATE_SAKURA:
      return {...state, data: action.data}
    default:
      return state
  }
}

export function updateSakura(data) {
  return {
    type: ACTION_UPDATE_SAKURA,
    data: data
  }
}
