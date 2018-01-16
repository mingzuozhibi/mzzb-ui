import {routerReducer, LOCATION_CHANGE} from 'react-router-redux'
import {getTitle} from '../../constant'

function routingReducer(state = {}, action) {
  state = routerReducer(state, action)
  switch (action.type) {
    case LOCATION_CHANGE:
      const props = action.payload
      const title = getTitle(props.pathname)
      return {...state, title, ...props}
    default:
      return state
  }
}

export {routingReducer}
