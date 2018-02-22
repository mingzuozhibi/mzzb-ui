import { AdminSakura } from './admin-sakura'

import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../common/root-reducer'

function mapStateToProps(state: RootState) {
  return {
    models: state.adminSakura.models,
    errors: state.adminSakura.errors,
    bodyWidth: 600
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  dispatch({type: 'listAdminSakuraRequest'})
  return {
    saveModel(model: {}) {
      dispatch({type: 'saveAdminSakuraRequest', model})
    },
    editModel(model: {}) {
      dispatch({type: 'editAdminSakuraRequest', model})
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminSakura)
