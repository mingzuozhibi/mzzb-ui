import { connect as nativeConnect } from 'react-redux'

function mapStateToProps(extraProps) {
  return (state) => ({
    ...state, ...extraProps
  })
}

function connect(mapDispatchToProps, extraProps) {
  return nativeConnect(
    mapStateToProps(extraProps),
    mapDispatchToProps
  )
}

export { connect }
