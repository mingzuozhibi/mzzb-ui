import React from 'react'
import {Icon} from 'antd'
import connect from '../../utils/connect'

function Reload({state, dispatch, action, isPending}) {
  return (
    <Icon
      className="header-icon"
      type={isPending(state) ? 'loading' : 'reload'}
      key="reolad"
      onClick={() => dispatch(action)}
    />
  )
}

function mapState(state) {
  return {
    state
  }
}

export default connect(mapState, undefined, Reload)
