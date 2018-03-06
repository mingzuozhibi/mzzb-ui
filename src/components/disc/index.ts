import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'
import { Disc, OwnProps } from './disc'
import { pageInfo } from './reducer'

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    ...state.disc, ...ownProps, session: state.app.session
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    editModel(id: number, model: {}) {
      dispatch({type: `edit${pageInfo.pageModel}Request`, id, model})
    },
    setRecord(id: number, model: {}) {
      dispatch({type: `set(record)${pageInfo.pageModel}Request`, id, model})
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Disc)
