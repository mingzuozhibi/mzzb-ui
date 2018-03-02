import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { User, OwnProps } from './user'
import { pageInfo } from './reducer'
import { withViewport } from '../../hoc/Viewport'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...state.user, ...ownProps
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    saveModel(model: {}) {
      dispatch({type: `addOne${pageInfo.pageModel}Request`, model})
    },
    editModel(id: number, model: {}) {
      dispatch({type: `setOne${pageInfo.pageModel}Request`, id, model})
    },
  }
}

const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(User)

export default withViewport(Connected)
