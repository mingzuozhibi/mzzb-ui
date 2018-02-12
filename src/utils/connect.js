import {connect} from 'react-redux'

function mapDispatch(onLoad) {
  return (dispatch) => {
    if (onLoad) onLoad(dispatch)
    return {dispatch}
  }
}

export default function (mapState, onEnter, component) {
  return connect(mapState, mapDispatch(onEnter))(component)
}
