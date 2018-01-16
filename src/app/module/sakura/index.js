const ACTION_UPDATE_SAKURA = '@@sakura/UPDATE_SAKURA'

function updateSakura(data) {
  return {
    type: ACTION_UPDATE_SAKURA,
    data: data
  }
}

const initState = {
  sakuraLists: []
}

function sakuraReducer(state = initState, action) {
  switch (action.type) {
    case ACTION_UPDATE_SAKURA:
      return {...state, sakuraLists: action.data}
    default:
      return state
  }
}

export {updateSakura, sakuraReducer}
