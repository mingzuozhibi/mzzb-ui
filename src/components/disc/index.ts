import { connect } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { Disc, OwnProps } from './disc'
import { pageInfo } from './reducer'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...state.disc, ...ownProps, session: state.app.session
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    editModel(id: number, model: {}) {
      dispatch({type: `edit${pageInfo.pageModel}Request`, id, model})
    },
    mergeRanks(id: number, model: {}) {
      dispatch({type: `merge(ranks)${pageInfo.pageModel}Request`, id, model})
    },
    mergePts(id: number, model: {}) {
      dispatch({type: `merge(pts)${pageInfo.pageModel}Request`, id, model})
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Disc)
