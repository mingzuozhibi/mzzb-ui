import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { AdminSakura, OwnProps } from './admin-sakura'
import { pageInfo } from './reducer'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...ownProps, ...state.adminSakura, session: state.app.session
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    saveModel(model: {}) {
      dispatch({type: `save${pageInfo.pageModel}Request`, model})
    },
    editModel(id: number, model: {}) {
      dispatch({type: `edit${pageInfo.pageModel}Request`, id, model})
    },
    dropModel(id: number) {
      dispatch({type: `drop${pageInfo.pageModel}Request`, id})
    },
    pushDiscs(id: number, pid: number) {
      dispatch({type: `push(discs)${pageInfo.pageModel}Request`, id, pid})
    },
    dropDiscs(id: number, pid: number) {
      dispatch({type: `drop(discs)${pageInfo.pageModel}Request`, id, pid})
    },
    searchDisc(id: number, asin: string) {
      dispatch({type: `search(discs)${pageInfo.pageModel}Request`, id, asin})
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminSakura)
