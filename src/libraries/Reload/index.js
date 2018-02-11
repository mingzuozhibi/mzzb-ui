import React from 'react'
import {Icon} from 'antd'
import {connect} from 'react-redux'

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

function mapStateToProps(state) {
  return {
    state
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reload)
