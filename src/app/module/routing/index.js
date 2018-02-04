import {LOCATION_CHANGE, push, routerReducer} from 'react-router-redux'
import {getTitle} from '../../constant'

const initState = {}

export default function routingReducer(state = initState, action) {
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

export function redirectTo(path) {
  return push(path)
}
