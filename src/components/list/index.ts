import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { OwnProps, List } from './list'
import { pageInfo } from './reducer'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...state.list, ...ownProps
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
    pushDisc(id: number, pid: number) {
      dispatch({type: `push(discs)${pageInfo.pageModel}Request`, id, pid})
    },
    dropDisc(id: number, pid: number) {
      dispatch({type: `drop(discs)${pageInfo.pageModel}Request`, id, pid})
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List)
