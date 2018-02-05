import produce from 'immer'

const ACTION_UPDATE_SAKURA = '@@sakura/UPDATE_SAKURA'

const initState = {
  data: []
}

export default function sakuraReducer(state = initState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case ACTION_UPDATE_SAKURA:
        draft.data = action.data
        break
      default:
    }
  })
}

export function updateSakura(data) {
  return {
    type: ACTION_UPDATE_SAKURA,
    data: data
  }
}
